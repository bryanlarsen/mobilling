## Mo-Billing

[ ![Codeship Status for bryanlarsen/mobilling](https://codeship.com/projects/87c92c00-4cd8-0132-5a34-5a56e8d5bc4a/status)](https://codeship.com/projects/47259)

### Running

* install vagrant
* vagrant up
* vagrant ssh
* cd /vagrant
* rails server -b 0.0.0.0

point your browser at http://localhost:3000/

### updating

git push enneahost +v3:master

(on root@sys.qchsag.ca)

restart consul-template-upstart-docker-2
docker ps
docker cp becbb:/app/public /var/mo-billing/

to migrate:

docker exec -it ff17 bash
env
su - u32809
export DATABASE_URL=postgres://postgres@postgres.service.consul/mobilling_production
rake db:migrate
exit
exit
restart docker-mobilling

