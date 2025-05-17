
FROM python:3.10-slim
WORKDIR /app
COPY . .
RUN pip install --no-cache-dir fastapi uvicorn pymongo pillow beautifulsoup4 playwright requests
RUN playwright install
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
