//Get the connection to Heroku Database
const pool = require('./sql_conn.js')

const validation = require('./validationUtils.js')

module.exports = { 
    pool, validation,
}
