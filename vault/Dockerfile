FROM hashicorp/vault:1.20.2

USER root

RUN apk add --no-cache \
    bash \
    curl \
    jq \
    coreutils \
    su-exec

COPY ./vault/tools/entry-point.sh /usr/local/bin/

SHELL ["/bin/bash", "-c"]

ENTRYPOINT [ "entry-point.sh" ]

CMD ["server", "-config=/vault/config/vault.hcl"]
