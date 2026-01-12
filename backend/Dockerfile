FROM python:3.11-slim

# System deps (optional but useful for some mysql drivers)
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install python deps first (better caching)
COPY requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy app code
COPY app /app/app

# Uvicorn will run on 0.0.0.0 inside container
EXPOSE 8000

# Production-ish run command
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
