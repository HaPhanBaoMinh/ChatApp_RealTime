FROM node:18.18.0-alpine3.17

WORKDIR /app

COPY package*.json ./

RUN yarn install --ignore-engines

COPY . .

RUN chmod +x /app/node_modules/.bin/nodemon

CMD ["npm", "start"]