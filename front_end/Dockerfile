FROM node:latest AS base
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install

FROM base as start
WORKDIR /usr/src/app
COPY . ./
COPY --from=base /usr/src/app/node_modules ./node_modules
RUN apt-get update -y && \
apt-get install wget libnss3-tools -y && \
wget https://github.com/FiloSottile/mkcert/releases/download/v1.4.3/mkcert-v1.4.3-linux-amd64 && \
mv mkcert-v1.4.3-linux-amd64 /usr/bin/mkcert && \
chmod +x /usr/bin/mkcert && \
mkcert localhost


EXPOSE 3005
CMD ["npm", "run", "start:https"]
