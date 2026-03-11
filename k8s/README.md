# Kubernetes Deployment Guide (Production)

This directory contains the Kubernetes manifests required to deploy the HMS application in a production environment.

## Prerequisites

- Kubernetes Cluster (v1.24+)
- `kubectl` command-line tool configured
- Docker (to build images)
- Nginx Ingress Controller installed in the cluster

## Directory Structure

- `01-namespace.yaml`: Creates the `hms-production` namespace.
- `02-secrets.yaml`: Stores sensitive data (DB passwords, JWT secret).
- `03-configmaps.yaml`: Stores non-sensitive configuration (DB host, Environment).
- `10-db.yaml`: MySQL Database Deployment, Service, and PVC.
- `20-backend.yaml`: Backend application Deployment and Service.
- `30-frontend.yaml`: Frontend application Deployment and Service.
- `40-ingress.yaml`: Ingress rules to expose the application.

## Deployment Steps

### 1. Build and Tag Images

Ensure your Docker images are built and available to your cluster nodes (either pushed to a registry or loaded efficiently).

```bash
docker build -t hms-backend:latest ./server
docker build -t hms-frontend:latest ./client
# If using a registry, tag and push:
# docker tag hms-backend:latest myregistry/hms-backend:latest
# docker push myregistry/hms-backend:latest
# (Update yaml files with new image names if necessary)
```

### 2. Apply Manifests

Apply the configuration in order:

```bash
kubectl apply -f k8s/01-namespace.yaml
kubectl apply -f k8s/02-secrets.yaml
kubectl apply -f k8s/03-configmaps.yaml
kubectl apply -f k8s/10-db.yaml
kubectl apply -f k8s/20-backend.yaml
kubectl apply -f k8s/30-frontend.yaml
kubectl apply -f k8s/40-ingress.yaml
```

### 3. Verify Deployment

Check the status of the pods:

```bash
kubectl get pods -n hms-production
```

Check logs if any pod crashes:

```bash
kubectl logs -f -l app=hms-backend -n hms-production
```

## Rollback Procedure

To roll back a deployment (e.g., backend) to the previous version:

```bash
kubectl rollout undo deployment/hms-backend -n hms-production
```

To view rollout history:

```bash
kubectl rollout history deployment/hms-backend -n hms-production
```

## Scaling

To scale the backend:

```bash
kubectl scale deployment/hms-backend --replicas=5 -n hms-production
```

## Maintenance

### Updating Secrets
Edit `k8s/02-secrets.yaml` (base64 encoded values) and apply. restart pods to pick up changes.

### Database Persistence
Data is stored in `mysql-data-pvc`. Ensure your detailed storage class configuration aligns with your cloud provider if running in the cloud.
