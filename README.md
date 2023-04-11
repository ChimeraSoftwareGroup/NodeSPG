# Getting started with node server

## Set up the node server

### In order to install the dependencies without vulnerabilities, run :
#### Install all the dependencies : `npm i`
#### Resolve potential security problem : `$ npm audit fix --force`

### Create your env file to stock your db login :
#### Create a file .env in the project root
#### In this file copy/paste : 

DB_USER = Your_DB_USER    
DB_HOST = Your_HOST        
DB_NAME = Your_DB_NAME    
DB_PASSWORD = 'YOUR_PASSWORD'    

### In the nodejs directory run :
####  Launch the node server : `npm run server`
#### The server will refresh whenever any change appears, because we're using nodemon :
It will run on port 3000 : http://localhost:3000/

## Launch Jest Test

### In the nodejs directory run :
#### All your test should be in : `./testJest`
#### Launch all the unitary test : `npm run test`
#### Your you can launch one of them using : `npm test ` + `yourTestName.spec.js`
#### You can change all those cmd in : `package.json`