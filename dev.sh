eval $(minikube docker-env)

# Secrets
kubectl delete secret gbv-bot-envs
kubectl create secret generic gbv-bot-envs --from-env-file .env

# App
kubectl delete -f kube
docker build -t nandanrao/gbv-botscribe:0.0.2 .
kubectl apply -f kube