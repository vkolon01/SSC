In order to launch the server the installation of Node.JS and MongoDB is required:

**https://nodejs.org/en**

**https://www.mongodb.com**

After installing MongoDB it can be launched by typing 'mongod' in the command line. 
In order to launch the SSC server MongoDB server must be running.

Node.js will also install npm package. Npm can be executed through a command line.
The project is dependent on many open source libraries and therefore they also need to be
installed. 

Dependencies can be installed by navigating to the location of the SSC folder by using the
command line and typing: 

`npm install`

When the installation is completed the server can be launched by typing the following:

`nodemon server.js`

When the server is running it can be accessed by navigating to **http://localhost:3000** using a
browser.

The first time the system is launched, an administrator account is created. 

Username: **administrator**

Password: **administrator**

The password can later be changed.

Testing module can be launched by typing **mocha** in the command line.