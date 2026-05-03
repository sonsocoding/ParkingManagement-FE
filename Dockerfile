FROM node:22-alpine AS build

WORKDIR /app

ARG VITE_API_URL=http://localhost:3000/api
ENV VITE_API_URL=$VITE_API_URL

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# nginx: production web server, which serves the static react app built by previous stage. 
FROM nginx:1.27-alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

# copies the built frontend files into Nginx’s static web folder.
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK CMD wget -qO- http://127.0.0.1/ || exit 1
