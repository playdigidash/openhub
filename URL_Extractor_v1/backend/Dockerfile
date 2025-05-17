FROM mcr.microsoft.com/playwright/python:v1.51.0-jammy

WORKDIR /app

COPY . .

RUN pip install --no-cache-dir fastapi uvicorn pymongo pillow beautifulsoup4 requests playwright

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
