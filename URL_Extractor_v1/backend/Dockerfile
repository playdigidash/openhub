FROM python:3.10

WORKDIR /app

COPY . /app

RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# Install Playwright and required browser binaries
RUN apt-get update && apt-get install -y wget gnupg
RUN playwright install --with-deps

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
