```bash
docker build -t 0xj4f/dsomm:latest .              
docker run --rm -p 80:8080 0xj4f/dsomm:latest

docker run --rm -p 80:8080 -v /tmp/generated.yaml:/srv/assets/YAML/generated/generated.yaml 0xj4f/dsomm:latest

docker run --rm -p 80:8080 \
    -v $(pwd)/generated.yaml:/srv/assets/YAML/generated/generated.yaml \
    -v $(pwd)/meta.yaml:/srv/assets/YAML/meta.yaml \
    0xj4f/dsomm:stable-20241229

docker run --rm -p 80:8080 \
    -v /tmp/generated.yaml:/srv/assets/YAML/generated/generated.yaml \
    -v /tmp/meta.yaml:/srv/assets/YAML/meta.yaml \
    0xj4f/dsomm:stable-20241229
docker tag 0xj4f/dsomm:latest 0xj4f/dsomm:v3.28.2



kubectl config use-context orbstack
helm template dsomm-release ./devsecops-maturitymodel > output.yaml

kubectl apply -f output.yaml
kubectl get pods,svc,cm

kubectl port-forward svc/dsomm-release 8080:8080




kubectl port-forward svc/dsomm-svc 8080:8080

# debugging
cat /srv/assets/YAML/meta.yaml
cat /srv/assets/YAML/generated/generated.yaml | less
```


initContainer
```bash
export DOCKER_IMAGE=0xj4f/dsomm:util
docker build -t ${DOCKER_IMAGE} .
docker push ${DOCKER_IMAGE}

```
----

https://github.com/devsecopsmaturitymodel/DevSecOps-MaturityModel-custom/blob/master/README.md
https://github.com/devsecopsmaturitymodel/DevSecOps-MaturityModel-data/blob/main/src/assets/YAML/default/implementations.yaml

