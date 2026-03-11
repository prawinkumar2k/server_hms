#!/bin/bash
set -e

echo "Starting k3s installation and configuration..."

# 1. Clean up existing kubeadm or k8s components if present
echo "Stopping any existing kubelet services..."
sudo systemctl stop kubelet || true
# Note: Full removal of kubeadm involves kubeadm reset, which we avoid automatically running here 
# to prevent accidental data loss. We assume the environment is either fresh or cleaned up.

# 2. Install k3s with specific flags
# - Disable standard traefik to use nginx-ingress instead
# - Enable metrics-server (enabled by default in k3s natively)
# - Set node permissions for kubeconfig to be readable by normal users
echo "Installing k3s (disabling traefik, metrics-server enabled implicitly)..."
curl -sfL https://get.k3s.io | sh -s - server \
  --disable traefik \
  --write-kubeconfig-mode 644 \
  --node-name hms-node-1

# Wait for k3s to be ready
export KUBECONFIG=/etc/rancher/k3s/k3s.yaml
echo "Waiting for k3s cluster to initialize..."
sleep 15
until kubectl get nodes; do
  echo "Waiting for API server..."
  sleep 5
done

# 3. Install NGINX Ingress Controller
echo "Installing NGINX Ingress Controller..."
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.2/deploy/static/provider/cloud/deploy.yaml

echo "Waiting for NGINX Ingress Controller to be ready..."
kubectl wait --namespace ingress-nginx \
  --for=condition=ready pod \
  --selector=app.kubernetes.io/component=controller \
  --timeout=120s

echo "k3s setup complete! You can now run ./deploy-k3s.sh to apply your manifests."
