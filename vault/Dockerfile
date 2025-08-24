FROM hashicorp/vault:1.20.2

USER root

RUN apk add --no-cache \
    bash \
    curl \
    jq \
    coreutils \
    su-exec

COPY ./vault/tools/entry-point.sh /usr/local/bin/

COPY ./vault/tools/generate-ssl-certs.sh /usr/local/bin/

RUN chmod +x /usr/local/bin/entry-point.sh \
             /usr/local/bin/generate-ssl-certs.sh

SHELL ["/bin/bash", "-c"]

ENTRYPOINT [ "entry-point.sh" ]

CMD ["server", "-config=/vault/config/vault.hcl"]
