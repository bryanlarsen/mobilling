# -*- mode: ruby -*-
# vi: set ft=ruby :

_script = <<SCRIPT
set -o errexit
#set -o pipefail
set -o nounset 
shopt -s failglob
set -o xtrace

export DEBIAN_FRONTEND=noninteractive

apt-get update
apt-get install -y python-software-properties make curl git postgresql-9.3 postgresql-contrib-9.3 libpq-dev imagemagick
apt-get -y dist-upgrade

sudo -i -u postgres createuser -a vagrant || true

exec sudo -i -u vagrant /bin/bash -- << EOF
cd /vagrant

curl -sSL https://get.rvm.io | bash -s stable
source /home/vagrant/.rvm/scripts/rvm
rvm use --install 2.1.2

set -o errexit
set -o pipefail
set -o nounset
shopt -s failglob
set -o xtrace

bundle install
EOF
SCRIPT

Vagrant.configure("2") do |config|
  config.vm.box = "ubuntu/trusty64"

  config.vm.provider "virtualbox" do |v|
    v.customize ["setextradata", :id, "VBoxInternal2/SharedFoldersEnableSymlinksCreate/v-root", "1"]
  end

  config.vm.provision "shell", inline: _script
  config.vm.network "forwarded_port", guest: 3000, host: 3000
end
