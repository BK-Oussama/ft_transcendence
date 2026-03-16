# --- STAGE 1: Build ---
FROM node:22-alpine AS builder
WORKDIR /app

# Install openssl for our "Strict SSL" requirement
RUN apk add --no-cache openssl

# Generate internal SSL certificates
RUN mkdir -p /app/secrets && \
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /app/secrets/privkey.pem \
    -out /app/secrets/cert.pem \
    -subj "/C=MO/ST=BM/L=BenGuerir/O=42/OU=ft_transcendence/CN=auth"

# Copy dependency files first for caching
COPY app/package*.json ./
RUN npm install

COPY app/.env ./           
COPY app/tsconfig.json ./
COPY app/prisma.config.* ./ 
COPY app/prisma ./prisma/
COPY app/src ./src

# Generate the Prisma 7 client and Build JS
RUN npx prisma generate
RUN npm run build 


# --- STAGE 2: Run ---
FROM node:22-alpine
WORKDIR /app

# Copy the compiled code
COPY --from=builder /app/dist ./dist

# Copy the node_modules (This now includes your generated Prisma Client!)
COPY --from=builder /app/node_modules ./node_modules

# Copy the rest
COPY --from=builder /app/secrets ./secrets
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.* ./
COPY --from=builder /app/package*.json ./

CMD ["sh", "-c", "npx prisma db push --accept-data-loss && node dist/src/main"]
