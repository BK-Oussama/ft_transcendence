FROM nginx:alpine

# Install openssl to generate certificates
RUN apk add --no-cache openssl

# Generate self-signed certificate (365 days)
RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
    -keyout /etc/ssl/private/nginx-selfsigned.key \
    -out /etc/ssl/certs/nginx-selfsigned.crt \
    -subj "/C=MO/ST=BM/L=BenGuerir/O=42/OU=ft_transcendence/CN=localhost"


# Copy our custom configuration
COPY ./tools/nginx.conf /etc/nginx/conf.d/default.conf

# Expose only the secure port
EXPOSE 443

CMD ["nginx", "-g", "daemon off;"]