//express is the framework we're going to use to handle requests
const express = require('express');

//Access the connection to Heroku Database
const pool = require('../utilities/exports').pool;

const router = express.Router();

/**
 * @api {get} /orders Request orders.
 * @apiName GetOrders
 * @apiGroup Orders
 *
 * @apiParam {Number} orderNumber (Optional) The order to look up.
 *
 * @apiSuccess {Boolean} success      Request success.
 * @apiSuccess {Object[]} orders      List of orders.
 * @apiSuccess {Number} OrderNumber   Order number.
 * @apiSuccess {Number} StoreNumber   Store order was placed at.
 * @apiSuccess {Number} CustomerID    Customer that the order belongs to.
 * @apiSuccess {String} PickupMethod  Pickup method of order.
 * @apiSuccess {String} PaymentMethod Payment method of order.
 * @apiSuccess {String} OrderTime     Time order was placed.
 *
 * @apiError (404: Order Not Found) {String} message "No orders found."
 */
router.get("/", (request, response, next) => {
    if (request.query.orderNumber) {
        request.query.orderNumber = parseInt(request.query.orderNumber);
        next();
    } else {
        const query = 'SELECT * FROM Orders ORDER BY OrderNumber';

        pool.query(query, (error, results) => {
            if (error) throw error;
            response.send({
                success: true,
                orders: results
            });
        });
    }
}, (request, response) => {
    const query = 'SELECT * FROM Orders WHERE OrderNumber = ?';
    const values = [request.query.orderNumber];

    pool.query(query, values, (error, results) => {
        if (error) throw error;
        if (results.length === 0) {
            response.status(404).send({
                message: "No orders found."
            });
        } else {
            response.send({
                success: true,
                orders: results
            });
        }
    });
});

/**
 * @api {get} /orders/items Request all items on order.
 * @apiName GetOrderItems
 * @apiGroup Orders
 *
 * @apiParam {Number} orderNumber (Optional) The order to look up.
 *
 * @apiSuccess {Boolean} success      Request success.
 * @apiSuccess {Object[]} orders      List of orders.
 * @apiSuccess {Number} OrderNumber   Order number.
 * @apiSuccess {Number} StoreNumber   Store order was placed at.
 * @apiSuccess {Number} CustomerID    Customer that the order belongs to.
 * @apiSuccess {String} PickupMethod  Pickup method of order.
 * @apiSuccess {String} PaymentMethod Payment method of order.
 * @apiSuccess {String} OrderTime     Time order was placed.
 *
 * @apiError (404: Item Not Found) {String} message "No items found."
 */
router.get("/items", (request, response, next) => {
    if (request.query.orderNumber) {
        next();
    } else {
        const query = 'SELECT * FROM OrderItems NATURAL JOIN Items ORDER BY OrderNumber';

        pool.query(query, (error, results) => {
            if (error) throw error;
            response.send({
                success: true,
                orders: results
            });
        });
    }
}, (request, response) => {
    const query = 'SELECT * FROM OrderItems NATURAL JOIN Items WHERE OrderNumber = ?';
    const values = [parseInt(request.query.orderNumber)];

    pool.query(query, values, (error, results) => {
        if (error) throw error;
        if (results.length === 0) {
            response.status(404).send({
                message: "No items found."
            });
        } else {
            response.send({
                success: true,
                orders: results
            });
        }
    });
});

/**
 * @api {get} /orders/customer Request order history of a customer.
 * @apiName GetCustomerOrders
 * @apiGroup Orders
 *
 * @apiParam {Number} id The customer ID to look up.
 *
 * @apiSuccess {Boolean} success      Request success.
 * @apiSuccess {Object[]} orders      List of orders.
 * @apiSuccess {Number} OrderNumber   Order number.
 * @apiSuccess {Number} StoreNumber   Store order was placed at.
 * @apiSuccess {Number} CustomerID    Customer that the order belongs to.
 * @apiSuccess {String} PickupMethod  Pickup method of order.
 * @apiSuccess {String} PaymentMethod Payment method of order.
 * @apiSuccess {String} OrderTime     Time order was placed.
 *
 * @apiError (400: Missing Parameters) {String} message "Missing required information."
 * @apiError (404: Order Not Found) {String}    message "No orders found."
 */
router.get("/customer", (request, response, next) => {
    if (request.query.id) {
        next();
    } else {
        response.status(400).send({
            message: "Missing required information",
        });
    }
}, (request, response) => {
    const query = 'SELECT * FROM Orders WHERE CustomerID = ? ORDER BY OrderNumber';
    const values = [parseInt(request.query.id)];

    pool.query(query, values, (error, results) => {
        if (error) throw error;
        if (results.length === 0) {
            response.status(404).send({
                message: "No orders found."
            });
        } else {
            response.send({
                success: true,
                orders: results
            });
        }
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
    const values = [request.query.orderNumber];

    pool.query(query, values, (error) => {
        if (error) throw error;
        next();
    });
}, (request, response) => {
    const query = 'DELETE FROM Orders WHERE OrderNumber = ?'
    const values = [request.query.orderNumber];

    pool.query(query, values, (error) => {
        if (error) throw error;
        response.send({
            success: true
        })
    });
});

module.exports = router;