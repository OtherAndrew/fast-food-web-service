//express is the framework we're going to use to handle requests
const express = require('express');

//Access the connection to Heroku Database
const pool = require('../utilities/exports').pool;

const router = express.Router();

/**
 * @api {delete} /orders/cancel Request to delete an order.
 * @apiName DeleteOrder
 * @apiGroup Orders
 *
 * @apiParam {Number} orderNumber The order to cancel.
 *
 * @apiSuccess {Boolean} success Request success.
 *
 * @apiError (400: Missing Parameters) {String} message "Missing required information."
 * @apiError (404: Order Not Found) {String}    message "No orders found."
 */
router.delete('/cancel', (request, response, next) => {
    if (!request.query.orderNumber) {
        response.status(400).send({
            message: "Missing required information."
        });
    } else {
        next();
    }
}, (request, response, next) => {
    const query = 'SELECT * FROM OrderItems WHERE OrderNumber = ?';
    const values = [parseInt(request.query.orderNumber)];

    pool.query(query, values, (error, results) => {
        if (error) throw error;

        if (results.length === 0) {
            response.status(404).send({
                message: "No orders found."
            });
        } else {
            next();
        }
    });
}, (request, response, next) => {
    const query = 'DELETE FROM OrderItems WHERE OrderNumber = ?';
    const values = [parseInt(request.query.orderNumber)];

    pool.query(query, values, (error) => {
        if (error) throw error;
        next();
    });
}, (request, response) => {
    const query = 'DELETE FROM Orders WHERE OrderNumber = ?'
    const values = [parseInt(request.query.orderNumber)];

    pool.query(query, values, (error) => {
        if (error) throw error;
        response.send({
            success: true
        })
    });
});

module.exports = router;