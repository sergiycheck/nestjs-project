FROM node:latest AS base
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install

FROM base as build
WORKDIR /usr/src/app
COPY . ./
COPY --from=dependencies /usr/src/app/node_modules ./node_modules
RUN npm run build

EXPOSE 3005
CMD ["npm", "run", "start:https"]
