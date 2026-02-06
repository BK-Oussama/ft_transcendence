FROM debian:11

# Install necessary packages
RUN apt update && apt install nginx openssl procps -y

COPY ./tools/conf/default /etc/nginx/sites-enabled/default

RUN openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout /etc/ssl/private/nginx-selfsigned.key -out /etc/ssl/certs/nginx-selfsigned.crt -subj "/CN=localhost"

CMD ["nginx", "-g", "daemon off;"]
