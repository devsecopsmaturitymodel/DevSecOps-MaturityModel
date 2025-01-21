FROM python:3.13.1-alpine

WORKDIR /app
COPY update_teams.py /app/update_teams.py
COPY requirements.txt /app/requirements.txt

RUN pip install -r requirements.txt
RUN chmod +x /app/update_teams.py

ENTRYPOINT ["/app/update_teams.py"]
