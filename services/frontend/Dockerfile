# STAGE 1: Build the React Application
FROM node:lts-alpine AS build
WORKDIR /app

# Copy dependency files
COPY ./app/package.json ./app/package-lock.json ./
RUN npm install

# Copy only the necessary project files
COPY ./app/index.html ./
COPY ./app/vite.config.js ./
COPY ./app/public ./public
COPY ./app/src ./src

# Build the project (generates the 'dist' folder)
RUN npm run build

# STAGE 2: Serve with Nginx
FROM nginx:alpine

# Copy the build output from Stage 1 to Nginx's html folder
COPY --from=build /app/dist /usr/share/nginx/html

# Copy our custom Nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]