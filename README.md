# fast-food-web-service

This is the Express.js backend for our Fast Food database project.

## Description

This project serves as the backend for a customer ordering system for a fast food restaurant.
It should be used in conjunction with [fast-food-database-project](https://github.com/OtherAndrew/fast-food-database-project).

Users can perform create, read, update, and delete operations on customers, orders, and items using the API methods provided.

## Getting Started

### Dependencies

- [MySQL](https://www.mysql.com)
- [Node.js](https://nodejs.org/en)
- [npm](https://www.npmjs.com)
- [Express.js](https://expressjs.com)

### Installing

Clone repository and install dependencies.

```shell
git clone https://github.com/OtherAndrew/fast-food-web-service
cd ./fast-food-web-service
npm install
```

In `utilities/sql_conn.js`, edit `user` and `password` to reflect your user credentials for your installation of MySQL.
Make sure the user you choose has read and write access .

### Executing program

#### 1. Initialize database

Using MySQL, run `SetupTables.sql` to create tables and insert initial values into the `fast_food` database.

#### 2. Run web service

In the directory containing the [web service](https://github.com/OtherAndrew/fast-food-web-service) (`fast-food-web-service`), run:

```shell
npm run local
```

Open [http://localhost:5000](http://localhost:5000) to view the web service in your browser.

#### 3. Run web app

In the directory containing the [web app](https://github.com/OtherAndrew/fast-food-database-project) (`fast-food-app`), run:

```shell
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the web app in your browser.

## Help

- Make sure `utilities/sql_conn.js` contains credentials for a user with read and write access.

- Make sure both the database and web service are up and running before running the web app.
 
The API documentation can be viewed by running

```shell
docme.sh
```

or

```shell
apidoc -i routes/ -o apidoc/ -d
```

and navigating to [http://localhost:5000/doc](http://localhost:5000/doc) while the web service is running.

## Authors

- [Andrew Nguyen](https://github.com/OtherAndrew)
- [Brian Nguyen](https://github.com/BrianNguyen636)

## Acknowledgments

- [tcss-450-web-service-starter](https://github.com/cfb3/tcss-450-web-service-starter)
- [README Template](https://gist.github.com/DomPizzie/7a5ff55ffa9081f2de27c315f5018afc)