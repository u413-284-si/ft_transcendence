FROM node:slim

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json /app

RUN npm install

RUN npm install -g http-server

CMD [ "npm", "start" ]
