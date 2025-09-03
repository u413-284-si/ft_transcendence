# Stage 1: Build the application
FROM node:slim AS builder

ENV NODE_ENV development

# System dependencies
RUN apt-get update && apt-get install -y \
    openssl \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /build

COPY package*.json ./

COPY ./scripts ./scripts

COPY ./app ./app

RUN npm ci --ignore-scripts \
  && npm run db:init \
  && npm run style \
  && npm run build \
  && npm prune --omit=dev

# Stage 2: Serve the application
FROM node:slim

ENV NODE_ENV production

RUN apt-get update && apt-get install -y \
    openssl \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

WORKDIR /

COPY --from=builder /build/app ./app

COPY --from=builder /build/node_modules ./node_modules

EXPOSE 4001

CMD [ "node", "./app/backend/src/app.js" ]
