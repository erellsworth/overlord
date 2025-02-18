FROM node:22 AS build

EXPOSE 80

RUN npm install -g @angular/cli@19

WORKDIR /overlord

COPY package*.json ./

RUN npm install

COPY . ./

RUN ng build --configuration=production

FROM nginx:latest

COPY --from=build overlord/dist/overlord/browser /usr/share/nginx/html

COPY --from=build overlord/overlord.nginx.conf /etc/nginx/conf.d/default.conf

CMD ["nginx", "-g", "daemon off;"]
