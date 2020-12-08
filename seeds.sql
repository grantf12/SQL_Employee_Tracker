DROP DATABASE IF EXISTS emp_tracker_db;
CREATE DATABASE emp_tracker_db;
USE emp_tracker_db;

CREATE TABLE department (
    id INT AUTO_INCREMENT,
    name VARCHAR(30), 
    PRIMARY KEY (id)
);

CREATE TABLE role (
    id INT AUTO_INCREMENT,
    title VARCHAR(30) NULL,
    salary DECIMAL(10,2) NULL,
    department_id INT,
    PRIMARY KEY (id)
);

CREATE TABLE employee (
    id INT AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT,
    manager_id INT NULL,
    PRIMARY KEY(id)
);

INSERT INTO department (name)
VALUES ('Sales'), ('Engineering'), ('Legal'), ('Finance');

INSERT INTO role (title, salary, department_id)
VALUES ('Sales Lead', 100000, 1),
('Salesperson', 75000, 1),
('Lead Engineer', 150000, 2),
('Software Engineer', 120000, 2),
('Legal Team Lead', 200000, 3),
('Lawyer', 175000, 3),
('Accountant', 125000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Robert", "Barath", 1, null),
("Jamie", "Lanaster", 2, 1),
("John", "Snow", 3, null),
("Arya", "Stark", 4, 3),
("The", "Hound", 5, null),
("Ricken", "Grey", 6, 5),
("Sansa", "Doe", 7, 5),
("Billy", "Bob", 7, 5);

SELECT * FROM department;
SELECT * FROM role;
SELECT * FROM employee;

SELECT  first_name, last_name, title, salary, department.name as deparment
FROM department
RIGHT JOIN  role 
	ON department.id = department_id
RIGHT JOIN employee
	ON employee.role_id = role.id
RIGHT JOIN employee
	ON employee.manager_id = employee.id
	