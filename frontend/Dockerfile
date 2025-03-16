FROM nginx:alpine

WORKDIR /var/www/html

COPY ./conf/nginx.conf /etc/nginx/nginx.conf

COPY ./index.html .

CMD ["nginx", "-g", "daemon off;"]
