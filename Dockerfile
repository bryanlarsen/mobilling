FROM tutum/buildstep

EXPOSE 80
ENV PORT 80
CMD ["/start", "web"]

VOLUME /app/public
VOLUME /app/public/uploads

ENV KV_SET:webapp/mobilling foo
ENV KV_SET:mobilling/cname v3.mo-billing.ca
ENV KV_SET:mobilling/public /var/mo-billing/public

ENV DOCKER_RUN_OPTIONS -P --env=DATABASE_URL=postgres://postgres@postgres.service.consul/mobilling_production -v /var/mo-billing/public/uploads:/app/public/uploads
