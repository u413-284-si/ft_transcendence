FROM owasp/modsecurity-crs:4.16.0-nginx-alpine-202506301206

COPY ./waf/nginx/template/default.conf.template /etc/nginx/templates/conf.d/default.conf.template
# COPY modsecurity.conf /etc/nginx/templates/conf.d/modsecurity.conf

CMD ["nginx", "-g", "daemon off;"]
