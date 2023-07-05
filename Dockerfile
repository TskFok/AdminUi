FROM node:20.3.1

WORKDIR /usr/src/app

COPY . .

RUN npm install

EXPOSE 9933

CMD [ "node", "server.js" ]