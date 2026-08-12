FROM node:24-bookworm-slim

ARG OPENCLAW_VERSION=2026.7.1-2

ENV NODE_ENV=production \
    HOME=/home/node \
    OPENCLAW_HOME=/home/node/.openclaw \
    OPENCLAW_STATE_DIR=/home/node/.openclaw \
    OPENCLAW_CONFIG_PATH=/home/node/.openclaw/openclaw.json \
    OPENCLAW_WORKSPACE_DIR=/home/node/.openclaw/workspace \
    OPENCLAW_DISABLE_BONJOUR=1

RUN npm install --global "openclaw@${OPENCLAW_VERSION}" \
    && npm cache clean --force \
    && mkdir -p /home/node/.openclaw /home/node/.config/openclaw /run/openclaw-control /opt/b2c-openclaw \
    && chown -R node:node /home/node/.openclaw /home/node/.config/openclaw /run/openclaw-control /opt/b2c-openclaw

COPY --chown=node:node openclaw/service /opt/b2c-openclaw/service
COPY --chown=node:node openclaw/service/templates /opt/b2c-openclaw/templates
COPY --chown=node:node openclaw/skills/build-b2c-mart /opt/b2c-openclaw/skill

USER node
WORKDIR /home/node

EXPOSE 18890

ENTRYPOINT ["node", "/opt/b2c-openclaw/service/server.mjs"]
