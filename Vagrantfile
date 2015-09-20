# -*- mode: ruby -*-
# vi: set ft=ruby :

_script = <<SCRIPT
set -o errexit
##set -o pipefail
set -o nounset
shopt -s failglob
set -o xtrace

export DEBIAN_FRONTEND=noninteractive

echo "America/Toronto" | sudo tee /etc/timezone
sudo dpkg-reconfigure --frontend noninteractive tzdata

apt-get update
apt-get install -y python-software-properties make curl git nodejs npm nodejs-legacy mysql-server mysql-client libmysqlclient-dev
apt-get -y dist-upgrade

mysqladmin -u root create wordpress || true
mysql -u root wordpress < /vagrant/old-site/wp-content/mysql.sql

exec sudo -i -u vagrant /bin/bash -- << EOF
cd /vagrant

gpg --keyserver hkp://keys.gnupg.net --recv-keys 409B6B1796C275462A1703113804BB82D39DC0E3
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
  config.vm.network "forwarded_port", guest: 4000, host: 4000
end
