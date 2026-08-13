FROM python:3.12-slim

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

RUN apt-get update \
    && apt-get install -y --no-install-recommends bash libgomp1 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY backend/requirements.txt /app/backend/requirements.txt
RUN python -m pip install --no-cache-dir -r /app/backend/requirements.txt

COPY backend /app/backend
COPY openclaw/skills/build-b2c-mart /app/openclaw/skills/build-b2c-mart

RUN chmod +x /app/backend/entrypoint.sh \
    /app/openclaw/skills/build-b2c-mart/scripts/run.sh \
    /app/openclaw/skills/build-b2c-mart/scripts/run_from_files.sh \
    /app/openclaw/skills/build-b2c-mart/scripts/run_update_from_files.sh \
    /app/openclaw/skills/build-b2c-mart/scripts/setup.sh

WORKDIR /app/backend
EXPOSE 8000

ENTRYPOINT ["/app/backend/entrypoint.sh"]
CMD ["gunicorn", "b2c_backend.wsgi:application", "--bind", "0.0.0.0:8000", "--workers", "2", "--timeout", "320"]
