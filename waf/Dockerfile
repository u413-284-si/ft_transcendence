FROM owasp/modsecurity-crs:4.16.0-nginx-alpine-202506301206

COPY ./waf/nginx/template/default.conf.template /etc/nginx/templates/conf.d/default.conf.template

COPY ./waf/modsecurity/REQUEST-900-EXCLUSION-RULES-BEFORE-CRS.conf /etc/modsecurity.d/owasp-crs/rules/REQUEST-900-EXCLUSION-RULES-BEFORE-CRS.conf

COPY ./waf/modsecurity/RESPONSE-999-EXCLUSION-RULES-AFTER-CRS.conf /etc/modsecurity.d/owasp-crs/rules/RESPONSE-999-EXCLUSION-RULES-AFTER-CRS.conf

CMD ["nginx", "-g", "daemon off;"]
