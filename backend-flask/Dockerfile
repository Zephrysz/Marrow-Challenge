FROM python:3.12-slim

WORKDIR /backend-flask

ENV FLASK_APP=/backend-flask/server.py
ENV FLASK_RUN_HOST=0.0.0.0

# for converting audio files to wav
RUN apt-get update && \
    apt-get install -y \
    ffmpeg \
    libsndfile1 \
    libopus0 \
    portaudio19-dev  \
    gcc \
    alsa-base \
    alsa-utils \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

EXPOSE 5000

COPY . .

CMD ["flask", "--app", "server.py", "run", "--debug"]
