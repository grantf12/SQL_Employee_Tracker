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
