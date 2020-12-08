var mysql = require("mysql");
var inquirer = require("inquirer");
const Choices = require("inquirer/lib/objects/choices");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    // May need to change based on user
    user: "root",
    password: "",
    database: "emp_tracker_db"
});

connection.connect(function(err) {
    if (err) throw err;
    runPrompt();
});

function runPrompt() {
    inquirer.prompt ({
        name: "action",
        type: "rawlist",
        message: "What would you like to do?",
        choices : [
            "View all employees",
            "View all employees by department",
            "View employees by manager",
            "Add Employee",
            "Remove Employee",
            // "Update Employee",
            "Add Role",
            "Remove Role",
            "Update Employee Manager"
        ]
    }).then(function(response){
        switch (response.action) {
            case "View all employees":
                viewAll();
                break;

            case "View all employees by department":
                viewDepartment();
                break;

            case "View employees by manager":
                viewManager();
                break;

            case "Add Employee":
                addEmp();
                break;
            
            case "Remove Employee":
                removeEmp();
                break;
            
            // case "Update Employee":
                // updateEmp();
                // break;
            
            case "Add Role":
                addRole();
                break;
            
            case "Remove Role":
                removeRole();
                break;
            
            case "Update Employee Manager":
                updateManager();
                break;
        }
    }) 
}

function viewAll() {
    
}