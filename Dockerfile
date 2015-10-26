FROM ruby:2.2.2

RUN apt-get update -qq && apt-get install -y --force-yes --no-install-recommends\
      build-essential \
      nodejs \
 && rm -rf /var/lib/apt/lists/*;

RUN apt-get update \
 && apt-get upgrade -y --force-yes \
 && rm -rf /var/lib/apt/lists/*;

RUN mkdir /jekyll
WORKDIR /jekyll

ADD Gemfile Gemfile.lock /jekyll/
RUN bundle install --without="development test"

CMD ["jekyll", "build"]

VOLUME /jekyll
