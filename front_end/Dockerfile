FROM node:latest

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . ./

EXPOSE 3005

ENV PORT=3005
ENV REACT_APP_WEB_API_HOST='localhost'

CMD ["npm", "run", "start"]
