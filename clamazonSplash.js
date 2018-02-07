var mysql = require("mysql"),
    inquirer = require("inquirer"),
    customer = require("./clamazonCustomer.js"),
    manager = require("./clamazonManager.js"),
    chosenItem,
    chosenItemQuantity,
    updatedQuantity,
    chosenItemPrice,
    purchaseQuantity;

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "clamazon_DB"
});

connection.connect(function (err) {
        if (err) throw err;
        console.log("-----------------------------------")
        console.log("Welcome to C L A M A Z O N")
        console.log("-----------------------------------")
        intialPrompt();
    });

function intialPrompt() {
    inquirer.prompt({
        name: "query",
        type: "list",
        message: "What would you like to do?",
        choices: ["Shop", "Access Admin Services"]
    }).then(function (answer) {
        if (answer.query === "Shop") {
            console.log(answer.query)
            customer.queryClamazonProducts();
        } else if (answer.query === "Access Admin Services") {
            console.log(answer.query)
            manager.queryManagerMenu("initial");
        }
    })
}