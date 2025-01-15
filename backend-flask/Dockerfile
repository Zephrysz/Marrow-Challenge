FROM python:3.12-slim

WORKDIR /backend-flask

ENV FLASK_APP=/backend-flask/server.py
ENV FLASK_RUN_HOST=0.0.0.0


COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 5000

COPY . .

CMD ["flask", "--app", "server.py", "run", "--debug"]
