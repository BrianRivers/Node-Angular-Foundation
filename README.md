#Veterans Services

This project uses Node.js and Ember.js  

The development environment will run in a Virtual Machine via VirtualBox using Vagrant.  
- [VirtualBox](https://www.virtualbox.org/wiki/Downloads)  
- [Vagrant](http://www.vagrantup.com/downloads.html)

You will need to install Node.js and several dependencies via the node package manager (npm) to compile and run the server side of the project
You will also need to use bower to install Ember.js and dependencies for the front-end/client side of the project
Below are detailed steps to get everything running  

###Before starting
Install [Node.js](http://nodejs.org/download/) and [Ruby](https://www.ruby-lang.org/en/downloads/) if not already done  

###Setting up Vagrant VM  

####Install Ruby Gems
````
sudo gem install chef
sudo gem install knife-solo
sudo gem install librarian-chef
````

####Install Chef cookbooks
````
cd chef
librarian-chef install
````

####Remove yum cookbook
````
rm -rf cookbooks/yum
````

####Provision and start the virtual machine
````
cd ../
vagrant up
````

####After install, reload the virtual machine
````
vagrant reload
````

###Installing development tools

####Install global tools via npm
````
npm install -g bower
npm install -g grunt-cli
npm install -g jshint
npm install -g mocha
npm install -g nodemon
````

###Install project dependencies

####Install via npm
````
npm install
````

####Install via bower
````
cd public/
bower install
````