FROM node:20-alpine AS build

ENV NODE_ENV=development
EXPOSE 3001

RUN mkdir -p /opt/app
WORKDIR /opt/app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build

# Stage 2: Production
FROM node:20-alpine AS production

ENV NODE_ENV=production

RUN mkdir -p /opt/app
WORKDIR /opt/app

COPY package*.json ./
RUN npm ci --production

COPY --from=build /opt/app/dist ./dist

EXPOSE 3001

CMD [ "node", "dist/server.js" ]
