## Mo-Billing

[ ![Codeship Status for bryanlarsen/mobilling](https://codeship.com/projects/87c92c00-4cd8-0132-5a34-5a56e8d5bc4a/status)](https://codeship.com/projects/47259)

### Requirements

* Ruby 2.1.2
* Postgres with UUID-OSSP extension

### Running

* install vagrant
* vagrant up
* vagrant ssh
* cd /vagrant
* cp config/database.yml.vagrant config/database.yml
* rake db:create
* rake db:migrate
* rake db:seed
* rails server

point your browser at http://localhost:3000/
