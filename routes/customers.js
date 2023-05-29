//express is the framework we're going to use to handle requests
const express = require('express');
const {isStringProvided} = require("../utilities/validationUtils");

//Access the connection to Heroku Database
const pool = require('../utilities/exports').pool;

const router = express.Router();

/**
 * @api {get} /customers Request customer information.
 * @apiName GetCustomers
 * @apiGroup Customers
 *
 * @apiParam {Number} id (Optional) The customer to find.
 *
 * @apiSuccess {Boolean} success      Request success.
 * @apiSuccess {Object[]} customers   List of customers.
 * @apiSuccess {Number} CustomerID    Customer ID.
 * @apiSuccess {String} Name          Customer name.
 * @apiSuccess {Number} RewardsPoints Customer rewards points total.
 *
 * @apiError (404: Customer Not Found) {String} message "No customers found."
 */
router.get("/", (request, response, next) => {
    if (isStringProvided(request.query.id)) {
        next();
    } else {
        const query = 'SELECT * FROM Customers';

        pool.query(query, (error, results) => {
            if (error) throw error;
            response.send({
                success: true,
                customers: results
            });
        });
    }
}, (request, response) => {
    const query = 'SELECT * FROM Customers WHERE CustomerID = ?';
    const values = [parseInt(request.query.id)];

    pool.query(query, values, (error, results) => {
        if (error) throw error;
        if (results.length === 0) {
            response.status(404).send({
                message: "No customers found."
            });
        } else {
            response.send({
                success: true,
                customers: results
            });
        }
    });
});

module.exports = router;