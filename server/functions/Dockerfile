FROM mcr.microsoft.com/dotnet/sdk:8.0 as build
#
#   INSTALL NODE
#
ENV NODE_VERSION=20.11.1
RUN apt install -y curl
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
ENV NVM_DIR=/root/.nvm
RUN . "$NVM_DIR/nvm.sh" && nvm install ${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm use v${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm alias default v${NODE_VERSION}
ENV PATH="/root/.nvm/versions/node/v${NODE_VERSION}/bin/:${PATH}"
RUN node --version
RUN npm --version

WORKDIR /usr/src/app/functions
COPY ./ ./

ARG AZURE_CONFIG_CONNECTION_STRING

ENV AzureWebJobsScriptRoot=/usr/src/app/functions \
    AzureFunctionsJobHost__Logging__Console__IsEnabled=true \
    AppConfig:ConnectionString="${AZURE_CONFIG_CONNECTION_STRING}" \
    AppConfig:Environment=Dev

RUN npm install -g azure-functions-core-tools nodemon --unsafe-perm true

ENTRYPOINT ["func", "start"]