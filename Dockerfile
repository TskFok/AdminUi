FROM node:20.2.0-bullseye-slim

WORKDIR /usr/src/app

COPY . .

RUN npm install

EXPOSE 9933

CMD [ "npm", "run", "dev", "--", "--port=9933" ]