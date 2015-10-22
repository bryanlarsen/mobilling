FROM ruby:2.2.2

RUN apt-get update -qq && apt-get install -y --force-yes --no-install-recommends\
      apt-transport-https \
      build-essential \
      curl \
      ca-certificates \
      git \
      lsb-release \
      python-all \
      rlwrap \
      libpq-dev \
      libxml2-dev \
      libxslt1-dev \
 && rm -rf /var/lib/apt/lists/*;

RUN curl https://deb.nodesource.com/node_4.x/pool/main/n/nodejs/nodejs_4.2.0-1nodesource1~jessie1_amd64.deb > node.deb \
 && dpkg -i node.deb \
 && rm node.deb

RUN npm install -g pangyp\
 && ln -s $(which pangyp) $(dirname $(which pangyp))/node-gyp\
 && npm cache clear\
 && node-gyp configure || echo ""


RUN apt-get update \
 && apt-get upgrade -y --force-yes \
 && rm -rf /var/lib/apt/lists/*;

ENV NODE_ENV production

RUN echo "America/Toronto" > /etc/timezone
RUN dpkg-reconfigure --frontend noninteractive tzdata

RUN mkdir /app
WORKDIR /app

ADD Gemfile Gemfile.lock /app/
RUN bundle install --deployment

ADD client/package.json /app/client/package.json
RUN cd /app/client && npm install

EXPOSE 80
ENV PORT 80
# CMD ["/start", "web"]

ENV KV_SET:webapp/mobilling foo
ENV KV_SET:mobilling/cname v3.mo-billing.ca
ENV KV_SET:mobilling/public /var/mo-billing/public

ENV DOCKER_RUN_OPTIONS -P --env=DATABASE_URL=postgres://postgres@postgres.service.consul/mobilling_production -v /var/mo-billing/public/uploads:/app/public/uploads

ADD . /app

ENV RAILS_ENV production
ENV DATABASE_URL postgres://postgres@172.17.0.29/mobilling_production

RUN rake assets:precompile
RUN rake custom:create_non_digest_assets

# FIXME!
ENV SECRET_KEY_BASE fixmerasdfasdfasdfasdff

CMD ["bundle", "exec", "unicorn", "-c", "config/unicorn.rb"]

VOLUME /app/public
VOLUME /app/public/uploads
