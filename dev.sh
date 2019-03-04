eval $(minikube docker-env)

kubectl delete -f kube
docker build -t vlabresearch/gbv-botscribe:0.0.1 .
kubectl apply -f kube
