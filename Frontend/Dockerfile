FROM node:18.18.0-alpine3.17 as build

WORKDIR /app

COPY package*.json ./

RUN npm install --force

COPY . .

# Build ứng dụng Node.js
RUN npm run build

# Bắt đầu giai đoạn thứ hai sử dụng Nginx
FROM nginx:1.25-alpine3.18
COPY --from=build /app/nginx.conf /etc/nginx/conf.d/default.conf
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=build /app/build .
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]