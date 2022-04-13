-- Drop the database if it already exists so that we can start over
DROP DATABASE IF EXISTS employee_trackerDB;

-- Create the database so that we can add tables
CREATE database employee_trackerDB;

-- Select the database we will work with
USE employee_trackerDB;

-- Create the deparment databse
CREATE TABLE department (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(45) NULL,
  PRIMARY KEY (id)
);

-- Create the role databse
CREATE TABLE role (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(45) NULL,
  salary DECIMAL(10.3) NULL,
  department_id INT NULL,
  PRIMARY KEY (id)
);

-- Create the employee databse
CREATE TABLE employee (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(45) NULL,
  last_name VARCHAR(45) NULL,
  role_id INT NULL,
  manager_id INT NULL,
  PRIMARY KEY (id)
);