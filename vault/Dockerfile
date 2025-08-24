FROM hashicorp/vault:1.20.2

USER root

RUN apk add --no-cache \
    bash \
    curl \
    jq \
    coreutils \
    openssl \
    su-exec

COPY ./vault/tools/entry-point.sh /usr/local/bin/

COPY ./vault/tools/setup-ssl-ca.sh /usr/local/bin/

RUN chmod +x /usr/local/bin/entry-point.sh \
             /usr/local/bin/setup-ssl-ca.sh

SHELL ["/bin/bash", "-c"]

ENTRYPOINT [ "entry-point.sh" ]

CMD ["server", "-config=/vault/config/vault.hcl"]
