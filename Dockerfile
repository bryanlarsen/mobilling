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

RUN npm install -g bower

RUN mkdir /app
WORKDIR /app

ENV RAILS_ENV staging

ADD Gemfile Gemfile.lock /app/
RUN bundle install --deployment --without="development test"

ADD .bowerrc bower.json /app/
RUN bower install --allow-root

ADD client/package.json /app/client/package.json
RUN cd /app/client && npm install

EXPOSE 80
ENV PORT 80
# CMD ["/start", "web"]

ADD . /app

ENV DATABASE_URL postgres://postgres@postgres.service.consul/mobilling_staging

RUN rake assets:precompile
RUN rake custom:create_non_digest_assets

CMD ["bundle", "exec", "unicorn", "-c", "config/unicorn.rb"]

VOLUME /app/public
VOLUME /app/public/uploads
