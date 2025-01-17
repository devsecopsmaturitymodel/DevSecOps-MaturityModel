FROM python:3.10-alpine

RUN pip install --no-cache-dir pyyaml
WORKDIR /app
COPY update_teams.py /app/update_teams.py
RUN chmod +x /app/update_teams.py

ENTRYPOINT ["/app/update_teams.py"]
