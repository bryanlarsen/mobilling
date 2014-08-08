## Mo-Billing

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