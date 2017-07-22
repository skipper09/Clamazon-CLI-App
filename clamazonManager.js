var mysql = require("mysql"),
    inquirer = require("inquirer"),
    chosenItem = "",
    chosenItemQuantity,
    chosenItemPrice,
    purchaseQuantity,
    updatedQuantity;

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "password",
    database: "clamazon_DB"
});

connection.connect(function(err) {
    if (err) throw err;
    queryManagerMenu();
});

var queryManagerMenu = function() {
    inquirer.prompt({
        name: "queryManager",
        type: "list",
        message: "Welcome back to Clamazon Admin Services. What would you like to do?"
        choices: ["View Products for Sale","Low Inventory","Add to Inventory","Add New Product"]
    })


};


