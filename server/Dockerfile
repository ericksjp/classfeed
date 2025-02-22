# development build

FROM node:lts-alpine

EXPOSE 3001

RUN mkdir -p /opt/app

WORKDIR /opt/app

COPY package*.json .
RUN npm install

COPY . .

CMD [ "npm", "run", "dev" ]
