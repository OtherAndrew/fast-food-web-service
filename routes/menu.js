//express is the framework we're going to use to handle requests
const express = require('express');

//Access the connection to Heroku Database
const pool = require('../utilities/exports').pool;

const router = express.Router();

/**
 * @api {get} /menu Request all items on the menu.
 * @apiName GetMenu
 * @apiGroup Menu
 *
 * @apiSuccess {Boolean} success   Request success.
 * @apiSuccess {Object[]} items    List of items.
 * @apiSuccess {Number} ItemNumber Item number.
 * @apiSuccess {String} ItemName   Item name.
 * @apiSuccess {Number} Price      Item price.
 */
router.get("/", (request, response) => {
    const query = 'SELECT ItemNumber, ItemName, Price FROM Items ORDER BY ItemNumber';

    pool.query(query, (error, results) => {
        if (error) throw error;
        response.send({
            success: true,
            items: results
        });
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
 * @apiSuccess {Boolean} success         Request success.
 * @apiSuccess {Object[]} items          List of items.
 * @apiSuccess {Number} ItemNumber       Item number.
 * @apiSuccess {String} ItemName         Item name.
 * @apiSuccess {Number} Price            Item price.
 * @apiSuccess {Number} EntreeItemNumber Entree item number.
 * @apiSuccess {Number} SideItemNumber   Side item number.
 * @apiSuccess {Number} DrinkItemNumber  Drink item number.
 */
router.get("/combos", (request, response) => {
    const query =
        'SELECT Items.ItemNumber, Items.ItemName, Price, Combos.EntreeItemNumber, Combos.SideItemNumber, Combos.DrinkItemNumber\n' +
        'FROM Items INNER JOIN Combos ON Items.ItemNumber = Combos.ItemNumber\n' +
        'WHERE Items.ItemNumber IN (SELECT ItemNumber FROM Combos)\n' +
        'ORDER BY Items.ItemNumber';

    pool.query(query, (error, results) => {
        if (error) throw error;
        response.send({
            success: true,
            items: results
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
