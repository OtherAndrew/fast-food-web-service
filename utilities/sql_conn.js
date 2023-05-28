// Obtain a Pool of DB connections.
const config = require("../config.js");
const mysql = require("mysql");

// const { Pool } = require("pg");
// const pool = new Pool(config.DB_OPTIONS);

const pool = mysql.createPool({
    host: 'localhost',
    user: 'andrew',
    password: 'password',
    database: 'fast_food'
});

module.exports = pool;
