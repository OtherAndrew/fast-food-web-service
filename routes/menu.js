//express is the framework we're going to use to handle requests
const express = require('express');

//Access the connection to Heroku Database
const pool = require('../utilities/exports').pool;

const router = express.Router();

router.get("/", (request, response) => {
    const query = 'SELECT ItemNumber, ItemName FROM Items ORDER BY ItemNumber';

    pool.query(query, (error, results) => {
        if (error) throw error;
        response.send({
            success: true,
            items: results
        });
        console.log(results);
    });
});

module.exports = router;
