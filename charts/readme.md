# DevSecOps-Maturity Model Helm Chart

`values.yaml` holds the values for meta.yaml, change the team values according to your composition.
```yaml
...
  teams: ['Front End Web', 'Back End Web', 'Mobile', 'Infrastructure']
  teamGroups:
    GroupA: ['Front End Web', 'Back End Web']
    GroupB: ['Front End Web', 'Mobile']
    GroupC: ['Back End Web', 'Infrastructure']
```

an init container will automatically update generated.yaml on runtime from the meta.yaml
`scripts/update_teams.py`

```bash
helm template dsomm-release ./devsecops-maturitymodel > output.yaml
kubectl apply -f output.yaml
kubectl port-forward svc/dsomm-svc 8080:8080

# to test if generated yaml has been updated
curl http://localhost:8080/assets/YAML/generated/generated.yaml | tail
```
