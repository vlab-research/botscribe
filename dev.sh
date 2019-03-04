eval $(minikube docker-env)

kubectl delete -f kube
docker build -t nandanrao/gbv-botscribe:0.0.1 .
kubectl apply -f kube
