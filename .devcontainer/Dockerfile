FROM mcr.microsoft.com/devcontainers/base:noble

RUN apt-get update \
  && apt-get -y install --no-install-recommends curl gnupg ca-certificates lsb-release

RUN install -m 0755 -d /etc/apt/keyrings \
  && curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg \
  && echo \
    "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
    $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null

RUN apt-get update \
  && apt-get install -y docker-ce-cli docker-compose-plugin

RUN groupadd -g 999 docker || true

RUN usermod -aG docker vscode

RUN curl -fsSL https://deb.nodesource.com/setup_23.x -o nodesource_setup.sh \
  && bash nodesource_setup.sh \
  && apt-get install -y nodejs \
  && rm nodesource_setup.sh

RUN npm install -g npm@11.3.0
