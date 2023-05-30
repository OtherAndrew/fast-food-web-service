//express is the framework we're going to use to handle requests
const express = require('express');
const {isStringProvided} = require("../utilities/validationUtils");

//Access the connection to Heroku Database
const pool = require('../utilities/exports').pool;

const router = express.Router();

/**
 * @api {get} /info/stores Request store locations.
 * @apiName GetStores
 * @apiGroup Info
 *
 * @apiParam {String} city (Optional) The city to find stores in.
 *
 * @apiSuccess {Boolean} success      Request success.
 * @apiSuccess {Object[]} stores      List of stores.
 * @apiSuccess {Number} StoreNumber   Store number.
 * @apiSuccess {String} StreetAddress Store street address.
 * @apiSuccess {String} City          Store city.
 * @apiSuccess {Number} ZIP           Store ZIP.
 * @apiSuccess {String} State         Store state.
 * @apiSuccess {String} Country       Store country.
 *
 * @apiError (404: Store Not Found) {String} message "No stores found."
 */
router.get("/stores", (request, response, next) => {
    if (isStringProvided(request.query.city)) {
        next();
    } else {
        const query =
            'SELECT StoreNumber, StreetAddress, City, ZIP, State, Country ' +
            'FROM StoreBranch ' +
            '    NATURAL JOIN Address ' +
            'ORDER BY StoreNumber';

        pool.query(query, (error, results) => {
            if (error) throw error;
            response.send({
                success: true,
                stores: results
            });
        });
    }
}, (request, response) => {
    const query =
        'SELECT StoreNumber, StreetAddress, City, ZIP, State, Country ' +
        'FROM StoreBranch  ' +
        '    NATURAL JOIN Address ' +
        'WHERE City = ? ' +
        'ORDER BY StoreNumber';

    const values = [request.query.city];

    pool.query(query, values, (error, results) => {
        if (error) throw error;
        if (results.length === 0) {
            response.status(404).send({
                message: "No stores found."
            });
        } else {
            response.send({
                success: true,
                stores: results
            });
        }
    });
});

/**
 * @api {get} /info/payment Request payment methods.
 * @apiName GetPaymentMethods
 * @apiGroup Info
 *
 * @apiSuccess {Boolean} success         Request success.
 * @apiSuccess {Object[]} paymentMethods List of payment methods.
 * @apiSuccess {String} Method           The payment method.
 */
router.get("/payment", (request, response) => {
    const query = 'SELECT * FROM PaymentMethod';

    pool.query(query, (error, results) => {
        if (error) throw error;
        response.send({
            success: true,
            paymentMethods: results
        });
    });
});

/**
 * @api {get} /info/pickup Request pickup methods.
 * @apiName GetPickupMethods
 * @apiGroup Info
 *
 * @apiSuccess {Boolean} success        Request success.
 * @apiSuccess {Object[]} pickupMethods List of pickup methods.
 * @apiSuccess {String} Method          The pickup method.
 */
router.get("/pickup", (request, response) => {
    const query = 'SELECT * FROM PickupMethod';

    pool.query(query, (error, results) => {
        if (error) throw error;
        response.send({
            success: true,
            pickupMethods: results
        });
    });
});

module.exports = router;
