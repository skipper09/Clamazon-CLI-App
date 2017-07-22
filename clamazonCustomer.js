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
    queryClamazonProducts();
});

var queryClamazonProducts = function() {
    connection.query("SELECT * FROM products", function(err, res) {
        console.log("-----------------------------------")
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].item_id + " | " 
                + res[i].product_name + " | " 
                + res[i].department_name + " | $" 
                + res[i].price + " | " 
                + res[i].stock_quantity);
        }
        console.log("-----------------------------------");
        idPrompt();
    });
}

var idPrompt = function() {
    inquirer.prompt({
        name: "id",
        message: "What is the id number of the item you would like to buy?",
        type: "input",
        validate: function(value) {
            if (isNaN(value) == false) {
                return true;
            } else {
                return false;
            }

        }
    }).then(function(answer) {
        connection.query("SELECT * FROM products WHERE ?", {
                item_id: answer.id
            },
            function(err, res) {
                if (err) throw err;
                chosenItem = res[0].product_name,
                    chosenItemQuantity = res[0].stock_quantity,
                    chosenItemPrice = res[0].price,
                    quantityPrompt();
            });
    })
}

var quantityPrompt = function() {
    inquirer.prompt({
        name: "quantity",
        message: "How many " + chosenItem + " would you like to purchase?",
        type: "input",
        validate: function(value) {
            if (isNaN(value) == false) {
                return true;
            } else {
                return false;
            }
        }
    }).then(function(answer) {
        purchaseQuantity = answer.quantity
        var total = answer.quantity * chosenItemPrice
        updatedQuantity = chosenItemQuantity - answer.quantity
        console.log("-----------------------------------");
        console.log("Your total will be $" + total)
        console.log("-----------------------------------");
        queryConfirm();
    });
}

var queryConfirm = function() {
    inquirer.prompt({
        name: "confirm",
        type: "confirm",
        message: "Confirm? Press enter to confirm your purchase"
    }).then(function(answer) {
        if (answer.confirm == true) {
            if (purchaseQuantity <= chosenItemQuantity) {
                connection.query("UPDATE products SET ? WHERE ?", [{

                            stock_quantity: updatedQuantity
                        },
                        {
                            product_name: chosenItem
                        }
                    ],
                    function(err, res) {})
                console.log("-----------------------------------");
                console.log("Thank you for your business!")
                queryClamazonProducts();
            } else {
                console.log("-----------------------------------");
                console.log("Sorry, insufficient quantity!")
                console.log("-----------------------------------");
                quantityPrompt();
            }
        } else {
            idPrompt()
        }
    })
}