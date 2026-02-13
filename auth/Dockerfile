# --- STAGE 1: Build ---
FROM node:22-alpine AS builder
WORKDIR /app

# Install openssl for our "Strict SSL" requirement
RUN apk add --no-cache openssl

# 1. Generate SSL Keys immediately
RUN mkdir -p /app/secrets && \
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /app/secrets/privkey.pem \
    -out /app/secrets/cert.pem \
    -subj "/C=MO/ST=BM/L=BenGuerir/O=42/OU=ft_transcendence/CN=auth"

# 2. Copy dependency files first for better caching
COPY package*.json ./
RUN npm install

# 3. Copy source and config (Absolute paths inside /app)
COPY tsconfig.json ./
COPY prisma ./prisma/
COPY prisma.config.* ./ 
COPY src ./src

# 4. Generate Prisma Client and Build JS
RUN npx prisma generate
RUN npm run build

# --- STAGE 2: Run ---
FROM node:22-alpine
WORKDIR /app

# Only copy what is absolutely necessary from the builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/secrets ./secrets
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.* ./ 
COPY package*.json ./

EXPOSE 443

# Start with database migration
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]



# # --- Stage 1: Build ---
# FROM node:lts-alpine AS build

# WORKDIR /app

# # Install openssl for certificate generation
# RUN apk add --no-cache openssl

# # Create secrets dir and generate self-signed cert
# RUN mkdir -p /app/secrets && \
#     openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
#     -keyout /app/secrets/privkey.pem \
#     -out /app/secrets/cert.pem \
#     -subj "/C=MO/ST=BM/L=BenGuerir/O=42/OU=ft_transcendence/CN=auth"

# # Install dependencies and generate Prisma Client
# COPY package*.json ./
# RUN npm install @prisma/client @prisma/adapter-pg pg
# RUN npm install

# COPY prisma ./prisma/
# COPY prisma.config.ts ./
# COPY tsconfig.json ./
# COPY . .

# RUN npx prisma generate
# RUN npm run build

# # --- Stage 2: Production ---
# FROM node:lts-alpine

# WORKDIR /app

# # Copy ONLY necessary files from build
# COPY --from=build /app/dist ./dist
# COPY --from=build /app/node_modules ./node_modules
# COPY --from=build /app/prisma ./prisma
# COPY --from=build /app/secrets ./secrets

# COPY package*.json ./

# # NestJS will listen on 443 for Strict SSL
# EXPOSE 443

# # Command: Deploy migrations THEN start the server
# CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]