# Stage 1: Build the application
FROM node:slim AS builder

ENV NODE_ENV production

WORKDIR /build

COPY package*.json ./
RUN npm ci --ignore-scripts

COPY ./scripts ./scripts
COPY ./app ./app

RUN npx prisma generate \
  && npm run style \
  && npm run build

# Stage 2: Serve the application
FROM node:slim

ENV NODE_ENV production

RUN apt update && apt install -y \
    openssl \
    && apt clean && rm -rf /var/lib/apt/lists/*

WORKDIR /

COPY --from=builder /build/app ./app
COPY --from=builder /build/node_modules ./node_modules

EXPOSE 4001

CMD [ "node", "./app/backend/src/app.js" ]
