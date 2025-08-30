FROM owasp/modsecurity-crs:4.16.0-nginx-alpine-202506301206

USER root

RUN apk add --no-cache su-exec

RUN mkdir -p /etc/nginx/conf \
		&& chown -R nginx:nginx /etc/nginx/conf

COPY ./waf/nginx/template/default.conf.template /etc/nginx/templates/conf.d/default.conf.template

COPY ./waf/nginx/tools/entry-point.sh /usr/local/bin/

COPY ./waf/modsecurity/REQUEST-900-EXCLUSION-RULES-BEFORE-CRS.conf /etc/modsecurity.d/owasp-crs/rules/REQUEST-900-EXCLUSION-RULES-BEFORE-CRS.conf

ENTRYPOINT [ "entry-point.sh" ]

CMD ["nginx", "-g", "daemon off;"]
