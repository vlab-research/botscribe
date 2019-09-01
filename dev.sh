eval $(minikube docker-env)

kubectl delete -f kube-dev
docker build -t localhost:32000/botscribe:registry .
docker push localhost:32000/botscribe:registry
kubectl apply -f kube-dev
