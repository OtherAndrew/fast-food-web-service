//express is the framework we're going to use to handle requests
const express = require('express');
const {isQuantityProvided, isStringProvided, notQuantityProvided} = require("../utilities/validationUtils");

//Access the connection to Heroku Database
const pool = require('../utilities/exports').pool;

const router = express.Router();

/**
 * @api {post} /orders/item Request to add an item to an order.
 * @apiName AddOrderItem
 * @apiGroup Orders
 *
 * @apiParam {Number} orderNumber The order to add an item to.
 * @apiParam {Number} itemNumber  The item to add.
 *
 * @apiSuccess {Boolean} success Request success.
 *
 * @apiError (400: Missing Parameters) {String}   message "Missing required information."
 * @apiError (400: Malformed Parameter) {String}  message "Malformed parameter. quantity must be a number."
 * @apiError (400: Malformed Parameter) {String}  message "Malformed parameter. modifications must be a string."
 * @apiError (404: Order Not Found) {String}      message "No orders found."
 * @apiError (404: Item Not Found) {String}       message "No items found."
 */
router.post('/item', (request, response, next) => {
    if (!request.body.orderNumber || !request.body.itemNumber) {
        response.status(400).send({
            message: "Missing required information."
        });
    } else if (notQuantityProvided(request.body.quantity)) {
        response.status(400).send({
            message: "Malformed parameter. quantity must be a positive number."
        });
    } else if (request.body.modifications && !isStringProvided(request.body.modifications)) {
        response.status(400).send({
            message: "Malformed parameter. modifications must be a non-empty string."
        });
    }else {
        next();
    }
}, (request, response, next) => {
    const query = 'SELECT * FROM Orders WHERE OrderNumber = ?';
    const values = [parseInt(request.body.orderNumber)];

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
    const query = 'SELECT * FROM Items WHERE ItemNumber = ?';
    const values = [parseInt(request.body.itemNumber)];

    pool.query(query, values, (error, results) => {
        if (error) throw error;
        if (results.length === 0) {
            response.status(404).send({
                message: "No items found."
            });
        } else {
            next();
        }
    });
}, (request, response) => {
    const query =
        'INSERT INTO OrderItems(OrderNumber, ItemNumber, Quantity, Modifications)\n' +
        'VALUES (?, ?, ?, ?)';
    const values = [
        parseInt(request.body.orderNumber),
        parseInt(request.body.itemNumber),
        request.body.quantity ? parseInt(request.body.quantity) : 1,
        request.body.modifications ? request.body.modifications : ''
    ];

    pool.query(query, values, (error) => {
        if (error) throw error;
        response.send({
            success: true
        })
    });
});

/**
 * @api {delete} /orders/item Request to remove an item from an order.
 * @apiName DeleteOrderItem
 * @apiGroup Orders
 *
 * @apiParam {Number} orderNumber The order to remove an item from.
 * @apiParam {Number} itemNumber  The item to remove.
 *
 * @apiSuccess {Boolean} success Request success.
 *
 * @apiError (400: Missing Parameters) {String} message "Missing required information."
 * @apiError (404: Order Not Found) {String}    message "No orders found."
 * @apiError (404: Item Not Found) {String}     message "No items found."
 */
router.delete('/item', (request, response, next) => {
    if (!request.query.orderNumber || !request.query.itemNumber) {
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
    const query = 'SELECT * FROM OrderItems WHERE OrderNumber = ? AND ItemNumber = ?';
    const values = [
        parseInt(request.query.orderNumber),
        parseInt(request.query.itemNumber)
    ];

    pool.query(query, values, (error, results) => {
        if (error) throw error;
        if (results.length === 0) {
            response.status(404).send({
                message: "No items found."
            });
        } else {
            next();
        }
    });
}, (request, response) => {
    const query = 'DELETE FROM OrderItems WHERE OrderNumber = ? AND ItemNumber = ?'
    const values = [
        parseInt(request.query.orderNumber),
        parseInt(request.query.itemNumber)
    ];

    pool.query(query, values, (error) => {
        if (error) throw error;
        response.send({
            success: true
        })
    });
});

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