# STAGE 1: Build the React Application
FROM node:lts-alpine AS build
WORKDIR /app

# Copy dependency files
COPY ./app/package.json ./app/package-lock.json ./
RUN npm install


# Correct the paths: Copy from host ./app/ to container current dir (.)
COPY ./app/tsconfig.json ./
COPY ./app/tsconfig.app.json ./
# Make sure you also have tsconfig.node.json if it's referenced!
COPY ./app/tsconfig.node.json ./ 

COPY ./app/tailwind.config.js ./
COPY ./app/index.html ./
COPY ./app/vite.config.js ./
COPY ./app/postcss.config.js ./
COPY ./app/src ./src
COPY ./app/public ./public


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