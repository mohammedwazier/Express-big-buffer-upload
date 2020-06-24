FROM node:12-slim

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .
EXPOSE 9000
CMD ["nodemon", "index.js"]