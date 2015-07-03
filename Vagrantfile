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
apt-get install -y python-software-properties make curl git postgresql-9.4 postgresql-contrib-9.4 libpq-dev imagemagick nodejs npm nodejs-legacy
apt-get -y dist-upgrade

npm install -g bower

sudo -i -u postgres createuser -a vagrant || true

ANDROID_SDK_FILENAME=android-sdk_r22.6-linux.tgz
ANDROID_SDK=http://dl.google.com/android/$ANDROID_SDK_FILENAME

#sudo apt-get install python-software-properties
#sudo add-apt-repository ppa:webupd8team/java
apt-get install -y nodejs nodejs-legacy npm git openjdk-7-jdk ant expect lib32z1 lib32ncurses5 lib32bz2-1.0 lib32stdc++6 xauth

curl -O $ANDROID_SDK
tar -xzvf $ANDROID_SDK_FILENAME
sudo chown -R vagrant android-sdk-linux/

echo "ANDROID_HOME=~/android-sdk-linux" >> /home/vagrant/.bashrc
echo "PATH=\$PATH:~/android-sdk-linux/tools:~/android-sdk-linux/platform-tools" >> /home/vagrant/.bashrc

#cp ~/android-sdk-linux/build-tools/19.1.0/zipalign ~/android-sdk-linux/platform-tools

npm install -g cordova
expect -c '
set timeout -1   ;
spawn /home/vagrant/android-sdk-linux/tools/android update sdk -u --all --filter platform-tool,android-19,build-tools-19.1.0
expect {
    "Do you accept the license" { exp_send "y\r" ; exp_continue }
    eof
}
'

sudo /home/vagrant/android-sdk-linux/platform-tools/adb kill-server
sudo /home/vagrant/android-sdk-linux/platform-tools/adb start-server
sudo /home/vagrant/android-sdk-linux/platform-tools/adb devices

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
bower install

cp config/database.yml.vagrant config/database.yml

rake db:create
rake db:migrate
rake db:seed

cd /vagrant/phonegap
cordova platform add android
cordova plugin add com.ionic.keyboard
cordova plugin add cordova-plugin-camera
cordova plugin add cordova-plugin-console
cordova plugin add cordova-plugin-device
cordova plugin add cordova-plugin-dialogs
cordova plugin add cordova-plugin-file
cordova plugin add cordova-plugin-file-transfer
cordova plugin add cordova-plugin-inappbrowser
cordova plugin add cordova-plugin-network-information
cordova plugin add cordova-plugin-statusbar
cordova plugin add cordova-plugin-whitelist

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
    lxc.customize 'cgroup.devices.allow', 'c 189:* rwm'
    lxc.customize 'mount.entry', '/dev/bus dev/bus none bind,optional 0 0'
  end

  config.vm.provision "shell", inline: _script
  config.vm.network "forwarded_port", guest: 3000, host: 3000
end
