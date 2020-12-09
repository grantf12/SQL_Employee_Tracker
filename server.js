var mysql = require("mysql");
var inquirer = require("inquirer");
var whatRoleID;
var empID;

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  // May need to change based on user
  user: "root",
  password: "",
  database: "emp_tracker_db",
});

connection.connect(function (err) {
  if (err) throw err;
  runPrompt();
});

function runPrompt() {
  inquirer
    .prompt({
      name: "action",
      type: "rawlist",
      message: "What would you like to do?",
      choices: [
        "View all employees",
        "View Departments",
        "View Roles",
        // "View employees by manager",
        "Add Employee",
        "Remove Employee",
        // "Update Employee",
        "Add Role",
        // "Remove Role",
        "Add Department",
        "Update Employee Role",
        "exit",
      ],
    })
    .then(function (response) {
      switch (response.action) {
        case "View all employees":
          viewAll();
          break;

        case "View Departments":
          viewDepartment();
          break;

        case "View Roles":
          viewRole();
          break;

        // case "View employees by manager":
        //     viewManager();
        //     break;

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

        // case "Remove Role":
        //     removeRole();
        //     break;
        case "Add Department":
          addDepart();
          break;

        case "Update Employee Role":
          updateRole();
          break;

        case "exit":
          connection.end();
          break;
      }
    });
}

function viewAll() {
  var query =
    "SELECT  first_name, last_name, title as role, salary, department.name as deparment FROM department RIGHT JOIN  role ";
  query +=
    "ON department.id = department_id RIGHT JOIN employee ON employee.role_id = role.id";
  connection.query(query, function (err, res) {
    if (err) throw err;
    console.table(res);
    runPrompt();
  });
}

function viewDepartment() {
  var query = "SELECT name as Department, id FROM department";
  connection.query(query, function (err, res) {
    if (err) throw err;
    console.table(res);
    runPrompt();
  });
}

function viewRole() {
  var query = "SELECT title as role, salary FROM role";
  connection.query(query, function (err, res) {
    if (err) throw err;
    console.table(res);
    runPrompt();
  });
}

function addDepart() {
  inquirer
    .prompt({
      name: "newDepart",
      type: "input",
      message: "What is the new Department?",
    })
    .then(function (response) {
      var query = "INSERT INTO department SET ?";
      connection.query(
        query,
        {
          name: response.newDepart,
        },
        function (err, res) {
          if (err) throw err;
          viewDepartment();
        }
      );
    });
}

function addRole() {
  connection.query("SELECT name, id FROM department", function (err, res) {
    if (err) throw err;
    const departStuff = res.map(function (department) {
      {
        return {
          name: department.name,
          value: department.id,
        };
      }
    });
    inquirer
      .prompt([
        {
          name: "newRole",
          type: "input",
          message: "What is the new role?",
        },
        {
          name: "newSal",
          type: "input",
          message: "What is the salary?",
        },
        {
          name: "newDep",
          type: "rawlist",
          message: "What is the department_id the new role is in?",
          choices: departStuff,
        },
      ])
      .then(function (response) {
        var query = "INSERT INTO role SET ?";
        connection.query(
          query,
          {
            title: response.newRole,
            salary: response.newSal,
            department_id: response.newDep,
          },
          function (err) {
            if (err) throw err;
            viewRole();
          }
        );
      });
  });
}

function addEmp() {
  connection.query("SELECT title, id FROM role", function (err, res) {
    if (err) throw err;
    var roleStuff = res.map(function (role) {
      return {
        name: role.title,
        value: role.id,
      };
    });
    connection.query(
      "SELECT first_name, last_name, id FROM employee",
      function (err, res) {
        var employStuff = res.map(function (employee) {
          return {
            name: employee.first_name + " " + employee.last_name,
            value: employee.id,
          };
        });

        inquirer
          .prompt([
            {
              name: "first_name",
              tpye: "input",
              message: "Enter Employee's First name",
            },
            {
              name: "last_name",
              tpye: "input",
              message: "Enter Employee's Last name",
            },
            {
              name: "role",
              type: "rawlist",
              message: "What is their role?",
              choices: roleStuff,
            },
            {
              name: "manager",
              type: "rawlist",
              message: "What is the manager's employee_id?",
              choices: employStuff,
            },
          ])
          .then(function (response) {
            connection.query(
              "INSERT INTO employee SET ?",
              {
                first_name: response.first_name,
                last_name: response.last_name,
                role_id: response.role,
                manager_id: response.manager,
              },
              function (err) {
                if (err) throw err;
                viewAll();
                runPrompt();
              }
            );
          });
      }
    );
  });
}

function updateRole() {
  connection.query("SELECT * FROM employee", function (err, res) {
    var employRole = res.map(function (employee) {
      return {
        name: employee.first_name + " " + employee.last_name,
        value: employee.id
      };
    });
      inquirer
        .prompt({
          name: "whatRole",
          type: "rawlist",
          message: "Which employee are you updating?",
          choices: employRole,
        })
        .then(function (response) {
            empID = response.whatRole
            console.log(empID)
          connection.query(
            "SELECT role_id FROM employee WHERE ?",
            { id: response.whatRole },
            function (err, res) {
              whatRoleID = res[0].role_id;
              console.log(whatRoleID)
            }
          );
          connection.query("SELECT * FROM role", function (err, res) {
            var allRoles = res.map(function (role) {
              return {
                name: role.title,
                value: role.id,
              };
            });
          inquirer
            .prompt({
              name: "newRole",
              type: "rawlist",
              message: "What is thier new role?",
              choices: allRoles,
            })
            .then(function (response) {
              var query2 ="UPDATE employee SET role_id = REPLACE (role_id, ? , ?) WHERE ?";
              connection.query(
                query2,
                [
                  whatRoleID,
                  response.newRole,
                  empID
                ],
                function (err, res) {
                  if (err) throw err;
                  viewAll();
                }
              );
            });
        });
    });
  });
}

function removeEmp() {
    connection.query("SELECT first_name, last_name, id FROM employee", function(err, res){
        var names = res.map(function(name){ 
            return{
            name: name.first_name + " " + name.last_name,
            value: name.id
        }})
    inquirer.prompt({
        name: "who",
        type:"rawlist",
        message: "Who would you like to remove?",
        choices: names
    }).then(function(response){
        connection.query("DELETE FROM employee WHERE ?", {id: response.who}, function(err) {
            if (err) throw err;
            console.log("Theyre outta' here!")
            viewAll();
        })
    })
    })
}
