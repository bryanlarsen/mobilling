## Mo-Billing

[ ![Codeship Status for bryanlarsen/mobilling](https://codeship.com/projects/87c92c00-4cd8-0132-5a34-5a56e8d5bc4a/status)](https://codeship.com/projects/47259)

### Running

* install vagrant
* vagrant up
* vagrant ssh
* cd /vagrant
* foreman start -f Procfile.dev

point your browser at http://localhost:4000/

### Running the Javascript tests

* vagrant up
* vagrant ssh
* cd /vagrant/client
* npm test

### updating

./build.sh
./run.sh

to migrate:

docker exec -it ff17 bash
env
su - u32809
export DATABASE_URL=postgres://postgres@postgres.service.consul/mobilling_production
rake db:migrate
exit
exit
restart docker-mobilling
