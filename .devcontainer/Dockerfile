FROM mcr.microsoft.com/devcontainers/base:noble

RUN apt-get update \
  && apt-get -y install --no-install-recommends \
  curl \
  && rm -rf /var/lib/apt/lists/*

RUN curl -fsSL https://deb.nodesource.com/setup_23.x -o nodesource_setup.sh \
  && bash nodesource_setup.sh \
  && apt-get install -y nodejs \
  && rm nodesource_setup.sh

RUN npm install -g npm@11.3.0
