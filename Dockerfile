FROM ruby:2.2.2

RUN apt-get update -qq && apt-get install -y build-essential

# for postgres
RUN apt-get install -y libpq-dev

# for nokogiri
RUN apt-get install -y libxml2-dev libxslt1-dev

# for a JS runtime
RUN apt-get install -y nodejs npm nodejs-legacy
RUN npm install -g bower

RUN echo "America/Toronto" > /etc/timezone
RUN dpkg-reconfigure --frontend noninteractive tzdata

RUN mkdir /app
WORKDIR /app

ADD Gemfile Gemfile.lock /app/
RUN bundle install --deployment

ADD bower.json /app/
ADD .bowerrc /app/
RUN bower install --allow-root

EXPOSE 80
ENV PORT 80
# CMD ["/start", "web"]

ADD . /app

# ENV RAILS_ENV production
# ENV DATABASE_URL postgres://postgres@postgres.service.consul/mobilling_production

RUN rake assets:precompile
RUN rake custom:create_non_digest_assets

CMD ["bundle", "exec", "unicorn", "-c", "config/unicorn.rb"]

VOLUME /app/public
VOLUME /app/public/uploads
