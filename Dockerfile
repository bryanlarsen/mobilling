FROM progrium/buildstep


ADD run.sh /run.sh
RUN chmod +x /run.sh

ONBUILD RUN mkdir -p /app
ONBUILD ADD . /app
ONBUILD RUN /build/builder

ENTRYPOINT ["/run.sh"]

RUN /start assets

EXPOSE 80
ENV PORT 80
CMD ["/start", "web"]

VOLUME /app/public

ENV KV_SET:webapp/mobilling foo
ENV KV_SET:mobilling/cname v3.qchsag.ca
ENV KV_SET:mobilling/public #jq<.Volumes["/app/public"]>#

ENV DOCKER_RUN_OPTIONS -P --env=DATABASE_URL=postgres://postgres@postgres.service.consul/mobilling_production
