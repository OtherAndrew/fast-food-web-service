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

/**
 * @api {get} /customers/address Request customer addresses.
 * @apiName GetCustomerAddress
 * @apiGroup Customers
 *
 * @apiParam {Number} id (Optional) The customer to find.
 *
 * @apiSuccess {Boolean} success      Request success.
 * @apiSuccess {Object[]} addresses   List of customer addresses.
 * @apiSuccess {Number} CustomerID    Customer ID.
 * @apiSuccess {String} StreetAddress Customer street address.
 * @apiSuccess {String} City          Customer city
 * @apiSuccess {Number} ZIP           Customer ZIP
 * @apiSuccess {String} State         Customer state.
 * @apiSuccess {String} Country       Customer country
 *
 * @apiError (404: Address Not Found) {String} message "No addresses found."
 */
router.get("/address", (request, response, next) => {
    if (isStringProvided(request.query.id)) {
        next();
    } else {
        const query =
            'SELECT CustomerID, StreetAddress, City, ZIP, State, Country ' +
            'FROM CustomerAddress NATURAL JOIN Address ' +
            'ORDER BY CustomerID';

        pool.query(query, (error, results) => {
            if (error) throw error;
            response.send({
                success: true,
                addresses: results
            });
        });
    }
}, (request, response) => {
    const query =
        'SELECT CustomerID, StreetAddress, City, ZIP, State, Country ' +
        'FROM CustomerAddress NATURAL JOIN Address ' +
        'WHERE CustomerID = ?';
    const values = [parseInt(request.query.id)];

    pool.query(query, values, (error, results) => {
        if (error) throw error;
        if (results.length === 0) {
            response.status(404).send({
                message: "No addresses found."
            });
        } else {
            response.send({
                success: true,
                addresses: results
            });
        }
    });
});

/**
 * @api {post} /customers/address Request to add a customer address.
 * @apiName AddAddress
 * @apiGroup Customers
 *
 * @apiParam {Number} id            The customer ID.
 * @apiParam {String} streetAddress The customer street address.
 * @apiParam {String} city          The customer city.
 * @apiParam {Number} zip           The customer ZIP.
 * @apiParam {String} state         The customer state.
 * @apiParam {String} country       The customer country.
 *
 * @apiSuccess {Boolean} success Request success.
 * @apiSuccess {Number} addressID The address ID.
 *
 * @apiError (400: Missing Parameters) {String} message        "Missing required information."
 * @apiError (400: Malformed Parameter) {String} message       "Malformed parameter(s)."
 * @apiError (404: Customer Not Found) {String} message        "No customers found."
 * @apiError (409: Customer Address Conflict) {String} message "Address already exists for customer."
 */
router.post('/address', (request, response, next) => {
    if (!request.body.id
            || !request.body.streetAddress
            || !request.body.city
            || !request.body.zip
            || !request.body.state
            || !request.body.country) {
        response.status(400).send({
            message: "Missing required information."
        });
    } else if (isNaN(request.body.id)
            || !isStringProvided(request.body.streetAddress)
            || !isStringProvided(request.body.city)
            || isNaN(request.body.zip)
            || !isStringProvided(request.body.state)
            || !isStringProvided(request.body.country)) {
        response.status(400).send({
            message: "Malformed parameter(s)."
        });
    } else {
        next();
    }
}, (request, response, next) => {
    // see if customer exists
    const query =
        'SELECT * FROM Customers WHERE CustomerID = ?';
    const values = [request.body.id];


    pool.query(query, values, (error, results) => {
        if (error) throw error;
        if (results.length === 0) {
            response.status(404).send({
                message: "No customers found."
            });
        } else {
            next();
        }
    });
}, (request, response, next) => {
    // see if address exists and get address id if it does, otherwise next
    const query =
        'SELECT AddressID ' +
        'FROM Address ' +
        'WHERE StreetAddress = ? ' +
        '    AND City = ? ' +
        '    AND ZIP = ? ' +
        '    AND State = ? ' +
        '    AND Country = ?';

    const values = [
        request.body.streetAddress,
        request.body.city,
        parseInt(request.body.zip),
        request.body.state,
        request.body.country,
    ];

    pool.query(query, values, (error, results) => {
        if (error) throw error;
        console.log(results)
        if (results.length > 0) {
            request.addressID = results[0].AddressID;
        }
        next();
    });
}, (request, response, next) => {
    if (request.addressID) {
        next();
    } else {
        // create new address
        const insert =
            'INSERT INTO Address ' +
            '    (StreetAddress, City, ZIP, State, Country) ' +
            'VALUES (?, ?, ?, ?, ?)';

        const values = [
            request.body.streetAddress,
            request.body.city,
            parseInt(request.body.zip),
            request.body.state,
            request.body.country,
        ];

        pool.query(insert, values, (error, results) => {
            if (error) throw error;
            request.addressID = results.insertId;
            next();
        });
    }
}, (request, response, next) => {
    // see if customer + address combo already exists
    const query =
        'SELECT * FROM CustomerAddress ' +
        'WHERE CustomerID = ? AND AddressID = ?';
    const values = [
        parseInt(request.body.id),
        parseInt(request.addressID)
    ];

    pool.query(query, values, (error, results) => {
        if (error) throw error;
        console.log(results)
        if (results.length > 0) {
            response.status(409).send({
                message: "Address already exists for customer."
            });
        } else {
            next();
        }
    });
}, (request, response) => {
    // add to customer addresses
    const query =
        'INSERT INTO CustomerAddress ' +
        '    (CustomerID, AddressID) ' +
        'VALUES (?, ?)';
    const values = [
        parseInt(request.body.id),
        parseInt(request.addressID),
    ];

    pool.query(query, values, (error) => {
        if (error) throw error;
        response.send({
            success: true,
            addressID: request.addressID
        });
    });
});

module.exports = router;