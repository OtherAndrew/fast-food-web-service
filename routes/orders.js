//express is the framework we're going to use to handle requests
const express = require('express');
const {isStringProvided} = require("../utilities/validationUtils");

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
 * @apiSuccess {Number} CustomerID    Customer order belongs to.
 * @apiSuccess {String} PickupMethod  Pickup method of order.
 * @apiSuccess {String} PaymentMethod Payment method of order.
 * @apiSuccess {String} OrderTime     Time order was placed.
 */
router.get("/", (request, response, next) => {
    if (request.query.ordernumber) {
        request.query.ordernumber = parseInt(request.query.ordernumber);
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
    const query = `SELECT * FROM Orders WHERE OrderNumber = ?`;
    const values = [request.query.ordernumber];

    pool.query(query, values, (error, results) => {
        console.log(results)
        if (error) throw error;
        if (results.length === 0) {
            response.send({
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

module.exports = router;