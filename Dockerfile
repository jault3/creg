FROM nginxinc/nginx-unprivileged:stable
COPY build /usr/share/nginx/html
