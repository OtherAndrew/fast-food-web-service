//express is the framework we're going to use to handle requests
const express = require('express');
const {isStringProvided} = require("../utilities/validationUtils");

//Access the connection to Heroku Database
const pool = require('../utilities/exports').pool;

const router = express.Router();

/**
 * @api {get} /stores Request store locations.
 * @apiName GetStores
 * @apiGroup Stores
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
 */
router.get("/", (request, response, next) => {
    if (isStringProvided(request.query.city)) {
        next();
    } else {
        const query =
            'SELECT StoreBranch.StoreNumber, Address.StreetAddress, Address.City, Address.ZIP, Address.State\n' +
            'FROM StoreBranch\n' +
            '    INNER JOIN Address ON StoreBranch.AddressID = Address.AddressID\n' +
            'ORDER BY StoreBranch.StoreNumber';

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
        'SELECT StoreBranch.StoreNumber, Address.StreetAddress, Address.City, Address.ZIP, Address.State\n' +
        'FROM StoreBranch\n' +
        '    INNER JOIN Address ON StoreBranch.AddressID = Address.AddressID\n' +
        'WHERE StoreBranch.AddressID IN (\n' +
        '    SELECT AddressID\n' +
        '    FROM Address\n' +
        '    WHERE City = ?\n' +
        ')\n' +
        'ORDER BY StoreBranch.StoreNumber';
    const values = [request.query.city];

    pool.query(query, values, (error, results) => {
        if (error) throw error;
        if (results.length === 0) {
            response.send({
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

module.exports = router;
