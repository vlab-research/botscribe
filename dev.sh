eval $(minikube docker-env)

kubectl delete -f kube
docker build -t vlabresearch/botscribe:0.0.3 .
kubectl apply -f kube
