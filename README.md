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

####SSH into Vagrant to the project folder
````
cd public/
vagrant ssh
cd /srv/site
````

####Run the application
If this is the first time running, make sure to initialize the application by passing the -initialize flag
````
node server.js -initialize
````

You can then quit the server at any time using Ctrl-C. Run the application by being in the application folder and typing
````
node server.js
````

You can also run the server that will auto restart after file changes by using nodemon
````
nodemon -L server.js
````