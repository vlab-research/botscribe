eval $(minikube docker-env)

kubectl delete -f kube
docker build -t vlabresearch/gbv-botscribe:0.0.2 .
kubectl apply -f kube
