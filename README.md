# Nerd Arbitrage
A piece of software to scrape several market places for comic books and identify arbitrage opportunities.

# Getting Started

## Requirements

To run the app locally, you will need 2 requirements. Here are some basic install instructions. 

- Node v14 & NPM - best way to install this is using [NVM](git@github.com:henrywalters/Nerd-Arbitrage.git).
    -  `$ curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.37.2/install.sh | bash` - install NVM using the installer script
    -  `$ nvm install 14` - install Node version 14
    -  `$ nvm use 14` - use Node version 14
- MySQL - install this through the command line
  - `$ sudo apt-get install mysql-server` - install MySQL
  - `$ sudo su` - change to the root user, this will prevent MySQL from screaming at you.
  - `$ sudo mysql_secure_installation` - go through the form however you'd like, doesn't really matter.
  - Next, you will want to create a database for Nerd Arbitrage and a user to access it.
  - `$ mysql` - open up a mysql client in the shell
  - `mysql> CREATE DATABASE nerd-arbitrage;` - create a new database. Note: nerd-arbitrage can be whatever you want.
  - `mysql> CREATE USER '[username]'@'localhost' IDENTIFIED WITH mysql_native_password BY '[password]';` - create a new user. Replace [username], [password] with the desired username and password.
  - `mysql> GRANT ALL PRIVILEGES ON nerd-arbitrage.* to '[username]'@'localhost';` - grant all privileges for nerd-arbitrage database to the new user.
  - `mysql> FLUSH PRIVILEGES;` - make the privileges take affect.
  - `mysql> exit; ` - exit the mysql client
  - `$ exit` - exit the sudo user

## Installing the App

First, begin by cloning the repository

`$ git clone https://github.com/henrywalters/Nerd-Arbitrage.git`

Next, change into that directory

`$ cd Nerd-Arbitrage`

Install the required npm packages

`$ npm install`

You will need to create an .env file to specify app secrets and connection details

`$ nano .env`

Copy and paste the following into the env file:

```
DB_TYPE=mysql
DB_HOST=localhost
DB_PORT=3306
DB_USER=[username]
DB_PASS=[password]
DB_NAME=nerd-arbitrage

APP_PORT=4200
```

Finally, run the database migrations to create the tables for the app

`$ npm run typeorm -- migration:run`


## Running the App

To run the app, simply run:

`$ npm run start:dev` - this will run the app and watch for changes :)

## Updating the database

To update the database, you will need to create a migration. To do so, run:

`$ npm run typeorm -- migration:generate -n MessageForTheMigration`

