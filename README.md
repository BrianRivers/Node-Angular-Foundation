#Node Angular Foundation

This project uses Node.js and Angular.js  

The development environment will run in a Virtual Machine via VirtualBox using Vagrant.  
- [VirtualBox](https://www.virtualbox.org/wiki/Downloads)  
- [Vagrant](http://www.vagrantup.com/downloads.html)

You will need to install Node.js and several dependencies via the node package manager (npm) to compile and run the server side of the project
You will also need to use bower to install Angular.js and dependencies for the front-end/client side of the project
Below are detailed steps to get everything running  

###Before starting
Install [Node.js](http://nodejs.org/download/) and [RVM stable with Ruby](http://rvm.io/rvm/install) if not already done  

###Setting up Vagrant VM  

####Install Ruby Gems
````
sudo gem install chef
sudo gem install knife-solo
sudo gem install librarian-chef
````  

####Download project and navigate to it in the in Terminal
````
git clone {project repo}
cd {project name}
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

###Installing development tools on your local computer (not on the VM)

####Install global tools via npm
````
npm install -g bower
npm install -g grunt-cli
npm install -g jshint
npm install -g mocha
npm install -g nodemon
````

###Install project dependencies

####Install via bower
````
cd public/
bower install
````  

####SSH into Vagrant to the project folder
````
cd ../
vagrant ssh
````

####Install via npm
````
npm install
````

####Run the application
If this is the first time running, make sure to initialize the application by passing the -initialize flag
````
node server.js -init
````

You can then quit the server at any time using Ctrl-C. Run the application by being in the application folder and typing
````
node server.js
````

You can also run the server that will auto restart after file changes by using nodemon
````
nodemon -L server.js
````  

####Testing the server
You can use the Postman REST client app for Chrome to make a GET request to http://localhost:3001/dbtest or simply navigate to this address in a browser.  
You should see a response with JSON data.
  
If you get a 503 service unavaiable you will need to restart Apache and then restart the server in the VM  
````
sudo service apache2 restart
node server.js
````