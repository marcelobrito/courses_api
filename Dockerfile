FROM node:22

WORKDIR /usr/src/api

COPY . .

RUN npm ci

RUN npm run build

EXPOSE 3000