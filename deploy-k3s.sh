#!/bin/bash
set -e

# Default path for k3s manifests
MANIFESTS_DIR="k3s"

echo "Starting deployment of HMS to k3s..."

# 1. Apply Namespace
echo "Applying Namespace..."
kubectl apply -f ${MANIFESTS_DIR}/01-namespace.yaml

# 2. Apply Secrets and ConfigMaps
echo "Applying Secrets and ConfigMaps..."
kubectl apply -f ${MANIFESTS_DIR}/02-secrets.yaml
kubectl apply -f ${MANIFESTS_DIR}/03-configmaps.yaml

# 3. Deploy Database
echo "Deploying Database..."
kubectl apply -f ${MANIFESTS_DIR}/10-db.yaml

# Give PVC some time to provision
sleep 5

# 4. Deploy Backend
echo "Deploying Backend..."
kubectl apply -f ${MANIFESTS_DIR}/20-backend.yaml

# 5. Deploy Frontend
echo "Deploying Frontend..."
kubectl apply -f ${MANIFESTS_DIR}/30-frontend.yaml

# 6. Apply Autoscaling rules
echo "Applying Horizontal Pod Autoscaler..."
kubectl apply -f ${MANIFESTS_DIR}/50-hpa.yaml

# 7. Apply Ingress
echo "Applying Ingress mapping..."
kubectl apply -f ${MANIFESTS_DIR}/40-ingress.yaml

# 8. Wait & Verify Rollout Status
echo "Waiting for deployments to roll out..."
kubectl rollout status deployment/hms-db -n hms-production --timeout=120s
kubectl rollout status deployment/hms-backend -n hms-production --timeout=120s
kubectl rollout status deployment/hms-frontend -n hms-production --timeout=120s

# 9. Health & Validation
echo "Deployment successful. Running health checks:"

echo "Node status:"
kubectl get nodes

echo "Pods status:"
kubectl get pods -A | grep -E 'hms-production|ingress-nginx'

echo "Service status:"
kubectl get svc -n hms-production

echo "Checking backend /health endpoint..."
BACKEND_SVC_IP=$(kubectl get svc backend -n hms-production -o jsonpath='{.spec.clusterIP}')
if [ -n "$BACKEND_SVC_IP" ]; then
    echo "Curling backend service internally..."
    kubectl run curl-test --image=curlimages/curl:latest -n hms-production --restart=Never --rm -i -- -s http://${BACKEND_SVC_IP}:3000/health || echo "Curl test pod skipped/failed."
else
    echo "Could not find backend service IP."
fi

echo "================================================="
echo "HMS is live on k3s!"
echo "Please verify everything works correctly."
