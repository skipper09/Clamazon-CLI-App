var mysql = require("mysql"),
    inquirer = require("inquirer"),
    chosenItem,
    chosenItemQuantity,
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
    initialQueryManagerMenu();
});

var initialQueryManagerMenu = function() {
    inquirer.prompt({
        name: "query",
        type: "list",
        message: "Welcome to C L A M A Z O N Admin Services. What would you like to do?",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
    }).then(function(answer) {
        if (answer.query === "View Products for Sale") {
            viewProducts();
        } else if (answer.query === "View Low Inventory") {
            lowInventory();
        } else if (answer.query === "Add to Inventory") {
            goFishin();
        } else if (answer.query === "Add New Product") {}

    })
};

var queryManagerMenu = function() {
    inquirer.prompt({
        name: "query",
        type: "list",
        message: "What would you like to do?",
        choices: ["View Products for Sale", "Low Inventory", "Add to Inventory", "Add New Product"]
    }).then(function(answer) {
        if (answer.query === "View Products for Sale") {
            viewProducts();
        } else if (answer.query === "Low Inventory") {
            lowInventory();
        } else if (answer.query === "Add to Inventory") {

        } else if (answer.query === "Add New Product") {}
    })
};

var viewProducts = function() {
    connection.query("SELECT * FROM products", function(err, res) {
        console.log("-----------------------------------")
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].item_id + " | " +
                res[i].product_name + " | " +
                res[i].department_name + " | $" +
                res[i].price + " | " +
                res[i].stock_quantity);
        }
        console.log("-----------------------------------");
        queryManagerMenu();
    });
};

var lowInventory = function() {
    connection.query("SELECT * FROM products WHERE stock_quantity BETWEEN ? and ?", [0, 5],
        function(err, res) {
            console.log("-----------------------------------")
            for (var i = 0; i < res.length; i++) {
                console.log(res[i].item_id + " | " +
                    res[i].product_name + " | " +
                    res[i].department_name + " | $" +
                    res[i].price + " | " +
                    res[i].stock_quantity);
            }
            console.log("-----------------------------------");
            queryManagerMenu();
        });
}

var goFishin = function() {
    connection.query("SELECT * FROM products", function(err, res) {
        inquirer.prompt({
            name: "addProduct",
            type: "list",
            message: "Which product would you like to go fishin' for today?",
            choices: function(value) {
                // console.log(res)
                var choiceArray = [];
                for (var i = 0; i < res.length; i++) {
                    choiceArray.push(res[i].product_name);
                }
                return choiceArray;
            }
        }).then(function(answer) {
            chosenItem = answer.addProduct;

            connection.query("SELECT * FROM products WHERE ?", {product_name: answer.addProduct },
                function(err, res) {
                    chosenItemQuantity = res[0].stock_quantity;
                })

            inquirer.prompt({
                name: "addQuantity",
                type: "input",
                message: "You have several hours to go fishin'. How many are you going to catch today?",
                validate: function(value) {
                    if (isNaN(value) == false) {
                        return true;
                    } else {
                        return false;
                    }
                }
            }).then(function(answer) {
                var catchQuantity = parseInt(answer.addQuantity);
                var updatedQuantity = chosenItemQuantity + catchQuantity;
                connection.query("UPDATE products SET ? WHERE ?", [{
                            stock_quantity: updatedQuantity
                        },
                        {
                            product_name: chosenItem
                        }
                    ],
                    function(err, res) {
                        console.log("-----------------------------------");
                        console.log("Wheh, what a long day! You've successfully updated your inventory of " + chosenItem + " to " + updatedQuantity)
                        console.log("-----------------------------------");
                        queryManagerMenu();
                    })
            });
        });
    });
};