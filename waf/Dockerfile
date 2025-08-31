FROM owasp/modsecurity-crs:4.17.1-nginx-alpine-202508061208

USER root

RUN mkdir -p /etc/nginx/conf \
		&& chown -R nginx:nginx /etc/nginx/conf

COPY ./waf/nginx/template/default.conf.template /etc/nginx/templates/conf.d/default.conf.template

COPY ./waf/modsecurity/REQUEST-900-EXCLUSION-RULES-BEFORE-CRS.conf /etc/modsecurity.d/owasp-crs/rules/REQUEST-900-EXCLUSION-RULES-BEFORE-CRS.conf

USER nginx

CMD ["nginx", "-g", "daemon off;"]
