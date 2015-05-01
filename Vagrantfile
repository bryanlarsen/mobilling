# -*- mode: ruby -*-
# vi: set ft=ruby :

_script = <<SCRIPT
set -o errexit
#set -o pipefail
set -o nounset
shopt -s failglob
set -o xtrace

export DEBIAN_FRONTEND=noninteractive

echo "deb http://apt.postgresql.org/pub/repos/apt/ trusty-pgdg main" > /etc/apt/sources.list.d/pgdg.list
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
apt-get update
apt-get install -y python-software-properties make curl git postgresql-9.4 postgresql-contrib-9.4 libpq-dev imagemagick nodejs npm nodejs-legacy
apt-get -y dist-upgrade

npm install -g bower

sudo -i -u postgres createuser -a vagrant || true

exec sudo -i -u vagrant /bin/bash -- << EOF
cd /vagrant

gpg --keyserver hkp://keys.gnupg.net --recv-keys 409B6B1796C275462A1703113804BB82D39DC0E3
curl -sSL https://get.rvm.io | bash -s stable
source /home/vagrant/.rvm/scripts/rvm
rvm use --install 2.2.0

set -o errexit
set -o pipefail
set -o nounset
shopt -s failglob
set -o xtrace

bundle install
bower install
npm install

cp config/database.yml.vagrant config/database.yml

rake db:create
rake db:migrate
rake db:seed
EOF
SCRIPT

begin
  LXC_VERSION = `lxc-ls --version`.strip
rescue
  LXC_VERSION = '0'
end
Vagrant.configure("2") do |config|
  config.vm.box = "ubuntu/trusty64"

  config.vm.provider "virtualbox" do |v|
    v.memory = 1536
    v.customize ["setextradata", :id, "VBoxInternal2/SharedFoldersEnableSymlinksCreate/v-root", "1"]
  end

  config.vm.provider "lxc" do |lxc, override|
    override.vm.box = "fgrehm/trusty64-lxc"
    if LXC_VERSION >= '1.1.0'
      lxc.customize 'aa_allow_incomplete', '1'
    end
  end

  config.vm.provision "shell", inline: _script
  config.vm.network "forwarded_port", guest: 3000, host: 3000
end
