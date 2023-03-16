FROM node:latest as base
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install

FROM base as build
WORKDIR /usr/src/app
COPY . ./
COPY --from=base /usr/src/app/node_modules ./node_modules
RUN npm run build

CMD npm run start:prod
