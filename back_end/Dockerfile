FROM node:latest

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . ./

EXPOSE 3027

ENV NODE_ENV='dev'
ENV WEB_API_APP_PORT=3027
ENV DB_USERNAME='root_user'
ENV DB_PASSWORD='pass_val'
ENV DB_NAME='nestjs-mongoose-proj'
ENV DB_HOST='database_mongo'
ENV DB_PORT=27017
ENV AUTH_MECHANISM='DEFAULT'
ENV AUTH_SOURCE='admin'

ENV PRIVATE_JWT_KEY='secretKeyForJwt'
ENV JWT_EXPIRES_SECONDS='99999s'

CMD ["npm","run", "start:debug"]
