FROM node:slim

WORKDIR /app
ENV NODE_ENV development

# Can be removed after development
RUN apt update && apt upgrade -y && apt install -y \
	curl

# Copy package.json and package-lock.json
COPY package*.json /app

# Install only dependencies needed to run the app in a production environment
RUN npm install 

# Copy the rest of the application code
COPY ./backend /app/backend
COPY ./frontend /app/frontend

CMD [ "node", "backend/src/app.js" ]