// set up the required mysql and inquirer components
const mysql = require("mysql");
const inquirer = require("inquirer");
require("console.table");

// details for the mysql database connection
const connection = mysql.createConnection({ 
  host: "localhost",
  port: "3306",
  user: "root",
  password: "",
  database: "employee_trackerDB"
})
// connect to the database - if successful, show the main prompt
connection.connect(function (err) {
  if (err) throw err;
  genesis();
});


//Run Genesis and show prompts
function genesis(){
  console.log("\ngenesis() invoked\n")
  inquirer.prompt([{
    type: 'list',
    pageSize: 15,
    name:'userChoice',
    message: 'What would you like to do?',
    choices: [
      'View All Departments'
      , 'View All Roles'
      , 'View All Employees'
      , 'Add Department'
      , 'Add Role'
      , 'Add Employee'
      , 'Update Employee Role'
      , 'Exit'
    ]
  }]).then((res)=>{
    console.log(res.userChoice);
    switch(res.userChoice){
      case 'View All Departments':
        viewAllDepartments();
        break;
      case 'View All Roles':
        viewAllRoles();
        break;
      case 'View All Employees':
        viewAllEmployees();
        break;
      case 'Add Department':
        addDepartment();
        break;
      case 'Add Role':
        addRole();
        break;
      case 'Add Employee':
        addEmployee();
        break;
      case 'Update Employee Role':
        updateEmployeeRole();
        break;
      case 'Exit':
        connection.end();
        break;
      }
    }).catch((err)=>{
  if(err)throw err;
  });
}

// Shows departments
function viewAllDepartments(){
  console.log("\nviewAllDepartments() invoked\n")
  let query = 
    `SELECT 
      department.id, 
      department.name
    FROM department`
  connection.query(query, (err, res)=>{
  if(err)throw err;
    console.table(res);
    genesis();
  });
}

// Shows roles
function viewAllRoles(){
    console.log("\nviewAllRoles() invoked\n")
  let query = 
    `SELECT 
      role.id,
      role.title, 
      department.name AS department,
      role.salary
    FROM role
    JOIN department
      ON department.id = role.department_id`
  connection.query(query, (err, res)=>{
  if(err)throw err;
    console.table(res);
    genesis();
  });
}

// Shows roles
function viewAllEmployees() {
  console.log("\nviewAllEmployees() invoked\n")
  let query = 
    `SELECT 
      employee.id, 
      employee.first_name, 
      employee.last_name, 
      role.title, 
      department.name AS department, 
      role.salary, 
      CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM employee
    LEFT JOIN role
      ON employee.role_id = role.id
    LEFT JOIN department
      ON department.id = role.department_id
    LEFT JOIN employee manager
      ON manager.id = employee.manager_id`
  connection.query(query, (err, res)=>{
    if (err) throw err;
    console.table(res);
    genesis();
  });
}

//adds department
function addDepartment(){
  console.log("\naddDepartment() invoked\n")
  inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        pageSize: 15,
        message: "Department Name: "
      }
    ]).then((res)=>{
    let query = `INSERT INTO department SET ?`;
    connection.query(query, {name: res.name},(err, res)=>{
      if(err) throw err;
      viewAllDepartments();
      genesis();
    });
  });
}

// adds role
function addRole(){
    console.log("\naddRole() invoked\n")
  var query = 
  `SELECT 
    department.id, 
    department.name, 
    role.salary
  FROM employee
  JOIN role
    ON employee.role_id = role.id
  JOIN department
    ON department.id = role.department_id
  GROUP BY department.id, department.name`

  connection.query(query,(err, res)=>{
    if(err)throw err;
    const department = res.map(({ id, name }) => ({
      value: id,
      name: `${id} ${name}`
    }));
    console.table(res);
    addToRole(department);
  });
}
  
function addToRole(department){
    console.log("\naddToRole(department) invoked\n")
    inquirer
      .prompt([
        {
          type: "input",
          name: "title",
          message: "Role title: "
        },
        {
          type: "input",
          name: "salary",
          message: "Role Salary: "
        },
        {
          type: "list",
          name: "department",
          pageSize: 15,
          message: "Department: ",
          choices: department
        }
      ]).then((res)=>{
        let query = `INSERT INTO role SET ?`;
  
        connection.query(query, {
            title: res.title,
            salary: res.salary,
            department_id: res.department
        },(err, res)=>{
            if(err) throw err;
            viewAllRoles();
            genesis();
        });
    });
}

//adds employee
function addEmployee() {
    console.log("\naddEmployee() invoked\n")
  let query = 
    `SELECT 
      role.id, 
      role.title, 
      role.salary 
    FROM role`
  connection.query(query, (err, res)=>{
    if(err)throw err;
    const role = res.map(({ id, title, salary }) => ({
      value: id, 
      title: `${title}`, 
      salary: `${salary}`
    }));
    console.table(res);
    employeeRoles(role);
  });
}

function employeeRoles(role) {
  console.log("\nemployeeRoles(role) invoked\n")
  inquirer
    .prompt([
    {
      type: "input",
      name: "firstName",
      message: "Employee First Name: "
    },
    {
      type: "input",
      name: "lastName",
      message: "Employee Last Name: "
    },
    {
      type: "list",
      name: "roleId",
      pageSize: 15,
      message: "Employee Role: ",
      choices: role
    }
  ]).then((res)=>{
    let query = `INSERT INTO employee SET ?`
    connection.query(query,{
      first_name: res.firstName,
      last_name: res.lastName,
      role_id: res.roleId
    },(err, res)=>{
      if(err) throw err;
      genesis();
    });
  });
}

// updates employee
function updateEmployeeRole(){
  console.log("\nupdateEmployeeRole() invoked\n")
  var query = 
    `SELECT 
      employee.id,
      employee.first_name, 
      employee.last_name, 
      role.title, 
      department.name, 
      role.salary, 
      CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM employee
    JOIN role
      ON employee.role_id = role.id
    JOIN department
      ON department.id = role.department_id
    LEFT JOIN employee manager
      ON manager.id = employee.manager_id`
  connection.query(query,(err, res)=>{
    if(err)throw err;
    const employeeChoices = res.map(({ id, first_name, last_name }) => ({
      value: id,
      name: `${first_name} ${last_name}`      
    }));
    console.table(res);
    updateTheRoleAssignedToTheEmployee(employeeChoices);
  });
}

function updateTheRoleAssignedToTheEmployee(employeeChoices){
  console.log("\nupdateTheRoleAssignedToTheEmployee(employeeChoices) invoked\n")
  let query = 
    `SELECT 
      role.id, 
      role.title, 
      role.salary 
    FROM role`
  
  connection.query(query,(err, res)=>{
    if(err)throw err;
    let roleChoices = res.map(({ id, title, salary }) => ({
      value: id, 
      title: `${title}`, 
      salary: `${salary}`      
    }));
    console.table(res);
    getTheRoleToAssignToTheEmployee(employeeChoices, roleChoices);
  });
}

function getTheRoleToAssignToTheEmployee(employeeChoices, roleChoices) {
  console.log("\ngetTheRoleToAssignToTheEmployee(employeeChoices, roleChoices) invoked\n")
  inquirer
    .prompt([
      {
        type: "list",
        name: "employee",
        pageSize: 15,
        message: "Employee who's role will be Updated: ",
        choices: employeeChoices
      },
      {
        type: "list",
        name: "role",
        pageSize: 15,
        message: "Select New Role: ",
        choices: roleChoices
      }
    ]).then((res)=>{
      let query = `UPDATE employee SET role_id = ? WHERE id = ?`
      connection.query(query,[ res.role, res.employee],(err, res)=>{
        if(err)throw err;
        viewAllEmployees();
        genesis();
      });
    });
}
