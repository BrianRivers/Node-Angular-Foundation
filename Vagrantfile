# -*- mode: ruby -*-
# vi: set ft=ruby :

# Vagrantfile API/syntax version. Don't touch unless you know what you're doing!
VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
# All Vagrant configuration is done here. The most common configuration
# options are documented and commented below. For a complete reference,
# please see the online documentation at vagrantup.com.

# Every Vagrant virtual environment requires a box to build off of.
config.vm.box = "precise64"

# The url from where the 'config.vm.box' box will be fetched if it
# doesn't already exist on the user's system.
config.vm.box_url = "http://files.vagrantup.com/precise64.box"

# Create a forwarded port mapping which allows access to a specific port
# within the machine from a port on the host machine. In the example below,
# accessing "localhost:8080" will access port 80 on the guest machine.

# Default site
config.vm.network :forwarded_port, guest: 80, host: 3000
# Node.js server
config.vm.network :forwarded_port, guest: 8000, host: 3001
# PostgreSQL server
config.vm.network :forwarded_port, guest: 5432, host: 5432

# Create a private network, which allows host-only access to the machine
# using a specific IP.
# config.vm.network :private_network, ip: "192.168.33.10"

# Create a public network, which generally matched to bridged network.
# Bridged networks make the machine appear as another physical device on
# your network.
# config.vm.network :public_network

# If true, then any SSH connections made will enable agent forwarding.
# Default value: false
# config.ssh.forward_agent = true

# Share an additional folder to the guest VM. The first argument is
# the path on the host to the actual folder. The second argument is
# the path on the guest to mount the folder. And the optional third
# argument is a set of non-required options.
config.vm.synced_folder Dir.pwd, "/srv/site"

# Setup ssh login to cd to synced_folder
config.vm.provision :shell, :inline => 'su - vagrant -c "echo cd /srv/site >> ~/.bashrc"'

# Provider-specific configuration so you can fine-tune various
# backing providers for Vagrant. These expose provider-specific options.
# Example for VirtualBox:
#
# config.vm.provider :virtualbox do |vb|
#   # Don't boot with headless mode
#   vb.gui = true
#
#   # Use VBoxManage to customize the VM. For example to change memory:
#   vb.customize ["modifyvm", :id, "--memory", "1024"]
# end
#
# View the documentation for the provider you're using for more
# information on available options.

# Enable provisioning with Puppet stand alone.  Puppet manifests
# are contained in a directory path relative to this Vagrantfile.
# You will need to create the manifests directory and a manifest in
# the file base.pp in the manifests_path directory.
#
# An example Puppet manifest to provision the message of the day:
#
# # group { "puppet":
# #   ensure => "present",
# # }
# #
# # File { owner => 0, group => 0, mode => 0644 }
# #
# # file { '/etc/motd':
# #   content => "Welcome to your Vagrant-built virtual machine!
# #               Managed by Puppet.\n"
# # }
#
# config.vm.provision :puppet do |puppet|
#   puppet.manifests_path = "manifests"
#   puppet.manifest_file  = "site.pp"
# end

# Install utilities
config.vm.provision :shell, :inline => "sudo apt-get update"
config.vm.provision :shell, :inline => "sudo apt-get install -y build-essential"
config.vm.provision :shell, :inline => "sudo apt-get install -y git"
config.vm.provision :shell, :inline => "sudo apt-get install -y libpq-dev"

# Enable provisioning with chef solo, specifying a cookbooks path, roles
# path, and data_bags path (all relative to this Vagrantfile), and adding
# some recipes and/or roles.
VAGRANT_JSON = JSON.parse(Pathname(__FILE__).dirname.join('chef/nodes', 'vagrant.json').read)

config.vm.provision :chef_solo do |chef|
	# Set log level to debug
	# chef.log_level = :debug

	# Specify paths relative to Vagrant file
	chef.cookbooks_path = ["chef/cookbooks", "chef/site-cookbooks"]
	chef.roles_path = "chef/roles"
	chef.data_bags_path = "chef/data_bags"

	# You may also specify custom JSON attributes:
	chef.run_list = VAGRANT_JSON.delete('run_list')
	chef.json = VAGRANT_JSON
end

# Setup PostgreSQL user and db
config.vm.provision :shell, :inline => "sudo -u postgres psql --command \"DROP DATABASE IF EXISTS dev_db\""
config.vm.provision :shell, :inline => "sudo -u postgres psql --command \"DROP ROLE IF EXISTS dev_db\""
config.vm.provision :shell, :inline => "sudo -u postgres psql --command \"CREATE ROLE dev_db WITH LOGIN ENCRYPTED PASSWORD 'dev_db' CREATEDB;\""
config.vm.provision :shell, :inline => "sudo -u postgres psql --command \"CREATE DATABASE dev_db WITH OWNER dev_db;\""
config.vm.provision :shell, :inline => "sudo -u postgres psql --command \"GRANT ALL PRIVILEGES ON DATABASE dev_db TO dev_db;\""

# Install nodemon to run node server
config.vm.provision :shell, :inline => "sudo npm install -g nodemon"

# Enable provisioning with chef server, specifying the chef server URL,
# and the path to the validation key (relative to this Vagrantfile).
#
# The Opscode Platform uses HTTPS. Substitute your organization for
# ORGNAME in the URL and validation key.
#
# If you have your own Chef Server, use the appropriate URL, which may be
# HTTP instead of HTTPS depending on your configuration. Also change the
# validation key to validation.pem.
#
# config.vm.provision :chef_client do |chef|
#   chef.chef_server_url = "https://api.opscode.com/organizations/ORGNAME"
#   chef.validation_key_path = "ORGNAME-validator.pem"
# end
#
# If you're using the Opscode platform, your validator client is
# ORGNAME-validator, replacing ORGNAME with your organization name.
#
# If you have your own Chef Server, the default validation client name is
# chef-validator, unless you changed the configuration.
#
#   chef.validation_client_name = "ORGNAME-validator"
end
