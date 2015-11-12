# -*- mode: ruby -*-
# vi: set ft=ruby :

_script = <<SCRIPT
set -o errexit
#set -o pipefail
set -o nounset
shopt -s failglob
set -o xtrace

export DEBIAN_FRONTEND=noninteractive

echo "America/Toronto" | sudo tee /etc/timezone
sudo dpkg-reconfigure --frontend noninteractive tzdata

echo "deb http://apt.postgresql.org/pub/repos/apt/ trusty-pgdg main" > /etc/apt/sources.list.d/pgdg.list
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
apt-get update
apt-get install -y python-software-properties make curl git postgresql-9.4 postgresql-contrib-9.4 libpq-dev imagemagick libgmp-dev build-essential
apt-get -y dist-upgrade

sudo -i -u postgres createuser -a vagrant || true

exec sudo -i -u vagrant /bin/bash -- << EOF

curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.29.0/install.sh | bash
source ~/.nvm/nvm.sh
nvm install 4.2.0

cd /vagrant

command curl -sSL https://rvm.io/mpapis.asc | gpg --import -
curl -sSL https://get.rvm.io | bash -s stable
source /home/vagrant/.rvm/scripts/rvm
rvm use --install 2.2.2
gem install bundler

set -o errexit
set -o pipefail
set -o nounset
shopt -s failglob
set -o xtrace

bundle install

cd client
npm install
cd ..

npm install -g bower
bower install

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
    v.memory = 2048
    v.customize ["setextradata", :id, "VBoxInternal2/SharedFoldersEnableSymlinksCreate/v-root", "1"]
  end

  config.vm.provider "lxc" do |lxc, override|
    override.vm.box = "fgrehm/trusty64-lxc"
    if LXC_VERSION >= '1.1.0'
      lxc.customize 'aa_allow_incomplete', '1'
    end
    lxc.customize 'cgroup.devices.allow', 'c 189:* rwm'
    lxc.customize 'mount.entry', '/dev/bus dev/bus none bind,optional 0 0'
  end

  config.vm.provision "shell", inline: _script
  config.vm.network "forwarded_port", guest: 3000, host: 3000
  config.vm.network "forwarded_port", guest: 4000, host: 4000
end
