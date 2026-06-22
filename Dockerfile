# Stage 1: Build the React application
FROM node:20-alpine as builder

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

RUN npm ci

COPY . .

ENV CI=true

RUN npm run build

# Stage 2: Serve the application with a lightweight web server
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 3001

CMD ["nginx", "-g", "daemon off;"]