FROM node:lts-alpine

# install simple http server for serving static content
RUN npm install -g http-server

# make the 'app' folder the current working directory
WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .
# build app for production with minification
RUN npm run build

CMD [ "http-server", "dist" ]