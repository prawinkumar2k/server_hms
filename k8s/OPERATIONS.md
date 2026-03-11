# HMS Production Operational Guide

This document outlines the standard operating procedures (SOPs) for managing the HMS application in the Kubernetes production environment.

## 1. System Status & Health

**Check Cluster Health:**
```bash
kubectl get nodes
```

**Check Application Status:**
```bash
kubectl get pods -n hms-production
```
*Expected Output:* All pods should be `1/1` and `Running`.

**Check Services & endpoints:**
```bash
kubectl get svc -n hms-production
```

## 2. Observability & Logging

**Backend Logs (Real-time):**
```bash
kubectl logs -f -l app=hms-backend -n hms-production
```

**Frontend Access Logs:**
```bash
kubectl logs -f -l app=hms-frontend -n hms-production
```

**Database Logs:**
```bash
kubectl logs -f -l app=hms-db -n hms-production
```

## 3. Database Management

**Access MySQL Shell:**
```bash
# Get the pod name
$POD_NAME=$(kubectl get pods -n hms-production -l app=hms-db -o jsonpath="{.items[0].metadata.name}")

# Exec into the pod
kubectl exec -it $POD_NAME -n hms-production -- mysql -u root -p
# Enter password (default: root)
```

**Backup Database (Manual):**
```bash
kubectl exec $POD_NAME -n hms-production -- mysqldump -u root -proot hms_db > backup.sql
```

## 4. Deployment Workflow (Code Update)

When code changes are made:

1.  **Build New Images:**
    ```bash
    docker build -t hms-backend:latest ./server
    docker build -t hms-frontend:latest ./client
    ```

2.  **Restart Pods (Zero Downtime):**
    ```bash
    kubectl rollout restart deployment/hms-backend -n hms-production
    kubectl rollout restart deployment/hms-frontend -n hms-production
    ```
    *Kubernetes will spin up new pods and drain old ones automatically.*

## 5. Scaling

**Scale Backend for Load:**
```bash
kubectl scale deployment/hms-backend --replicas=5 -n hms-production
```

**Scale Down:**
```bash
kubectl scale deployment/hms-backend --replicas=2 -n hms-production
```

## 6. Configuration Updates

To change Environment Variables (e.g., `LOG_TO_CONSOLE`):

1.  Edit `k8s/03-configmaps.yaml`
2.  Apply changes:
    ```bash
    kubectl apply -f k8s/03-configmaps.yaml
    ```
3.  Restart deployment to pick up changes:
    ```bash
    kubectl rollout restart deployment/hms-backend -n hms-production
    ```

## 7. Troubleshooting

**Pod Pending?**
Check for resource constraints or PVC binding issues:
```bash
kubectl describe pod <pod-name> -n hms-production
```

**Pod CrashLoopBackOff?**
Check logs for the crashed instance:
```bash
kubectl logs <pod-name> -n hms-production --previous
```

## 8. Emergency Rollback

If a bad deployment breaks production:

```bash
kubectl rollout undo deployment/hms-backend -n hms-production
```
