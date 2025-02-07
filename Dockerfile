FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
#Copiez aussi package-lock.json si vous l'utilisez
COPY package-lock.json ./


RUN npm install

COPY . .

# Spécifiez l'environnement de production
RUN npm run build --configuration production

FROM nginx:alpine

COPY --from=build /app/dist/odc-activity /usr/share/nginx/html --chown=nginx:nginx/

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
