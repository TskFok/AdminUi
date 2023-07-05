FROM node:20.3.1

WORKDIR /usr/src/app

COPY . .

RUN npm install -g npm@9.7.2
RUN npm install --no-bin-links

EXPOSE 9933

CMD [ "npm", "run", "dev" ]