FROM node:latest

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . ./

RUN apt-get update && \ 
  apt-get -y dist-upgrade

CMD ["npm","run", "build"]
