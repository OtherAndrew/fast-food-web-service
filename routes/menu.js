//express is the framework we're going to use to handle requests
const express = require('express');

//Access the connection to Heroku Database
const pool = require('../utilities/exports').pool;

const router = express.Router();

/**
 * @api {get} /menu Request items on the menu.
 * @apiName GetMenu
 * @apiGroup Menu
 *
 * @apiParam {Number} itemNumber (Optional) The item to look up.
 *
 * @apiSuccess {Boolean} success   Request success.
 * @apiSuccess {Object[]} items    List of items.
 * @apiSuccess {Number} ItemNumber Item number.
 * @apiSuccess {String} ItemName   Item name.
 * @apiSuccess {Number} Price      Item price.
 *
 * @apiError (404: Item Not Found) {String} message "No items found."
 */
router.get("/", (request, response, next) => {
    if (request.query.itemNumber) {
        next();
    } else {
        const query = 'SELECT ItemNumber, ItemName, Price FROM Items ORDER BY ItemNumber';

        pool.query(query, (error, results) => {
            if (error) throw error;
            response.send({
                success: true,
                items: results
            });
        });
    }
}, (request, response) => {
    const query = 'SELECT ItemNumber, ItemName, Price FROM Items WHERE ItemNumber = ?';
    const values = [parseInt(request.query.itemNumber)];

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
 * @api {get} /menu/entrees Request all entrees on the menu.
 * @apiName GetEntrees
 * @apiGroup Menu
 *
 * @apiSuccess {Boolean} success   Request success.
 * @apiSuccess {Object[]} items    List of items.
 * @apiSuccess {Number} ItemNumber Item number.
 * @apiSuccess {String} ItemName   Item name.
 * @apiSuccess {Number} Price      Item price.
 */
router.get("/entrees", (request, response) => {
    const query = 'SELECT ItemNumber, ItemName, Price FROM Items WHERE ItemNumber IN (SELECT ItemNumber FROM EntreeItems) ORDER BY ItemNumber';

    pool.query(query, (error, results) => {
        if (error) throw error;
        response.send({
            success: true,
            items: results
        });
    });
});

/**
 * @api {get} /menu/sides Request all sides on the menu.
 * @apiName GetSides
 * @apiGroup Menu
 *
 * @apiSuccess {Boolean} success   Request success.
 * @apiSuccess {Object[]} items    List of items.
 * @apiSuccess {Number} ItemNumber Item number.
 * @apiSuccess {String} ItemName   Item name.
 * @apiSuccess {Number} Price      Item price.
 */
router.get("/sides", (request, response) => {
    const query = 'SELECT ItemNumber, ItemName, Price FROM Items WHERE ItemNumber IN (SELECT ItemNumber FROM SideItems) ORDER BY ItemNumber';

    pool.query(query, (error, results) => {
        if (error) throw error;
        response.send({
            success: true,
            items: results
        });
    });
});

/**
 * @api {get} /menu/drinks Request all drinks on the menu.
 * @apiName GetDrinks
 * @apiGroup Menu
 *
 * @apiSuccess {Boolean} success   Request success.
 * @apiSuccess {Object[]} items    List of items.
 * @apiSuccess {Number} ItemNumber Item number.
 * @apiSuccess {String} ItemName   Item name.
 * @apiSuccess {Number} Price      Item price.
 */
router.get("/drinks", (request, response) => {
    const query = 'SELECT ItemNumber, ItemName, Price FROM Items WHERE ItemNumber IN (SELECT ItemNumber FROM DrinkItems) ORDER BY ItemNumber';

    pool.query(query, (error, results) => {
        if (error) throw error;
        response.send({
            success: true,
            items: results
        });
    });
});

/**
 * @api {get} /menu/limited Request all limited items on the menu.
 * @apiName GetLimited
 * @apiGroup Menu
 *
 * @apiSuccess {Boolean} success   Request success.
 * @apiSuccess {Object[]} items    List of items.
 * @apiSuccess {Number} ItemNumber Item number.
 * @apiSuccess {String} ItemName   Item name.
 * @apiSuccess {Number} Price      Item price.
 */
router.get("/limited", (request, response) => {
    const query = 'SELECT ItemNumber, ItemName, Price FROM Items WHERE ItemNumber IN (SELECT ItemNumber FROM LimitedItems) ORDER BY ItemNumber';

    pool.query(query, (error, results) => {
        if (error) throw error;
        response.send({
            success: true,
            items: results
        });
    });
});

/**
 * @api {get} /menu/breakfast Request all breakfast items on the menu.
 * @apiName GetBreakfast
 * @apiGroup Menu
 *
 * @apiSuccess {Boolean} success   Request success.
 * @apiSuccess {Object[]} items    List of items.
 * @apiSuccess {Number} ItemNumber Item number.
 * @apiSuccess {String} ItemName   Item name.
 * @apiSuccess {Number} Price      Item price.
 */
router.get("/breakfast", (request, response) => {
    const query = 'SELECT ItemNumber, ItemName, Price FROM Items WHERE ItemNumber IN (SELECT ItemNumber FROM BreakfastItems) ORDER BY ItemNumber';

    pool.query(query, (error, results) => {
        if (error) throw error;
        response.send({
            success: true,
            items: results
        });
    });
});

/**
 * @api {get} /menu/combos Request all combos on the menu.
 * @apiName GetCombos
 * @apiGroup Menu
 *
 * @apiSuccess {Boolean} success    Request success.
 * @apiSuccess {Object[]} combos    List of combos.
 * @apiSuccess {Number} ComboNumber Combo number.
 * @apiSuccess {String} ComboName   Combo name.
 * @apiSuccess {String} Entree      Entree item name.
 * @apiSuccess {String} Side        Side item name.
 * @apiSuccess {String} Drink       Drink item name.
 * @apiSuccess {Number} Price       Combo price.
 */
router.get("/combos", (request, response) => {
    const query =
        'SELECT c1.ItemNumber AS ComboNumber, c1.ItemName AS ComboName, i1.ItemName AS Entree, i2.ItemName as Side, i3.ItemName as Drink, c1.Price\n' +
        'FROM (SELECT * FROM (Items NATURAL JOIN Combos)) c1\n' +
        '    LEFT JOIN Items i1 ON c1.EntreeItemNumber = i1.ItemNumber\n' +
        '    LEFT JOIN Items i2 ON c1.SideItemNumber = i2.ItemNumber\n' +
        '    LEFT JOIN Items i3 ON c1.DrinkItemNumber = i3.ItemNumber';

    pool.query(query, (error, results) => {
        if (error) throw error;
        response.send({
            success: true,
            combos: results
        });
    });
});

/**
 * @api {get} /menu/vegetarian Request all vegetarian items on the menu.
 * @apiName GetVegetarian
 * @apiGroup Menu
 *
 * @apiSuccess {Boolean} success   Request success.
 * @apiSuccess {Object[]} items    List of items.
 * @apiSuccess {Number} ItemNumber Item number.
 * @apiSuccess {String} ItemName   Item name.
 * @apiSuccess {Number} Price      Item price.
 */
router.get("/vegetarian", (request, response) => {
    const query =
        'SELECT ItemNumber, ItemName, Price\n' +
        'FROM Items\n' +
        'WHERE ItemNumber IN (\n' +
        '    SELECT ItemNumber\n' +
        '    FROM ItemNutrition\n' +
        '    WHERE Vegetarian = 1)\n' +
        'ORDER BY ItemNumber';

    pool.query(query, (error, results) => {
        if (error) throw error;
        response.send({
            success: true,
            items: results
        });
    });
});

/**
 * @api {get} /menu/vegan Request all vegan items on the menu.
 * @apiName GetVegan
 * @apiGroup Menu
 *
 * @apiSuccess {Boolean} success   Request success.
 * @apiSuccess {Object[]} items    List of items.
 * @apiSuccess {Number} ItemNumber Item number.
 * @apiSuccess {String} ItemName   Item name.
 * @apiSuccess {Number} Price      Item price.
 */
router.get("/vegan", (request, response) => {
    const query =
        'SELECT ItemNumber, ItemName, Price\n' +
        'FROM Items\n' +
        'WHERE ItemNumber IN (\n' +
        '    SELECT ItemNumber\n' +
        '    FROM ItemNutrition\n' +
        '    WHERE Vegan = 1)\n' +
        'ORDER BY ItemNumber';

    pool.query(query, (error, results) => {
        if (error) throw error;
        response.send({
            success: true,
            items: results
        });
    });
});

module.exports = router;
