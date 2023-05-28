//express is the framework we're going to use to handle requests
const express = require('express');

//Access the connection to Heroku Database
const pool = require('../utilities/exports').pool;

const router = express.Router();

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

router.get("/entrees", (request, response) => {
    const query = 'SELECT ItemNumber, ItemName FROM Items WHERE ItemNumber IN (SELECT ItemNumber FROM EntreeItems) ORDER BY ItemNumber';

    pool.query(query, (error, results) => {
        if (error) throw error;
        response.send({
            success: true,
            items: results
        });
    });
});

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

router.get("/combos", (request, response) => {
    const query =
        'SELECT Items.ItemNumber, Items.ItemName, Price, Combos.EntreeItemNumber, Combos.SideItemNumber, Combos.DrinkItemNumber\n' +
        'FROM Items\n' +
        'INNER JOIN Combos ON Items.ItemNumber = Combos.ItemNumber\n' +
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

router.get("/vegetarian", (request, response) => {
    const query =
        'SELECT ItemName\n' +
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

router.get("/vegan", (request, response) => {
    const query =
        'SELECT ItemName\n' +
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
