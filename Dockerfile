# Étape 1 : Construire l'application Angular
FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./
COPY package-lock.json ./

RUN npm install --force

COPY . .

RUN npm run build

# Étape 2 : Servir l'application avec Nginx
FROM nginx:alpine

# Copier la configuration Nginx (voir nginx.conf ci-dessous)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copier les fichiers de l'application construite. Il est crucial de copier *dans* /usr/share/nginx/html, et non de créer un sous-répertoire.
COPY --from=build /app/dist/odc-activity/browser/* /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
