const mysql = require("mysql");
const inquirer = require("inquirer");
require("console.table");

const connection = mysql.createConnection({ 
  host: "localhost",
  port: "3306",
  user: "root",
  password: "",
  database: "employee_trackerDB"
})

connection.connect(function (err) {
  if (err) throw err;
  genesis();
});

// Startup prompt to ask what table the user wants to view/add
function genesis(){
  inquirer.prompt([
  {
    type: 'list',
    name:'userChoice',
    message: 'What would you like to do?',
    choices: [
    'View All Employees',
    'View All Departments',
    'View All Roles',
    'Add Employee',
    'Add Role',
    'Add Department',
    'Update Employee Role'
    ]
      
  }

  ]).then((res)=>{
    console.log(res.userChoice);
    switch(res.userChoice){
      case 'View All Employees':
        viewEmployee();
        break;
      case 'View All Departments':
        viewDept();
        break;
      case 'View All Roles':
        viewRole();
        break;
      case 'Add Employee':
        addEmployee();
        break;
      case 'Add Role':
        addRole();
        break;
      case 'Add Department':
        addDepartment();
        break;
      case 'Update Employee Role':
        updateRole();
        break;
      }
    }).catch((err)=>{
  if(err)throw err;
  });
}



//VIEWING

// View All Employees
function viewEmployee() {
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

//View All Departments
function viewDept(){
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

//View All Roles
function viewRole(){
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


//ADDING




//Add An Employee
function addEmployee() {
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

//Add Role
function addRole(){
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
            genesis();
        });
    });
}

//Add Department
function addDepartment(){
  inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        message: "Department Name: "
      }
    ]).then((res)=>{
    let query = `INSERT INTO department SET ?`;
    connection.query(query, {name: res.name},(err, res)=>{
      if(err) throw err;
      genesis();
    });
  });
}




//UPDATE

//UPDATE EMPLOYEE ROLE
function updateRole(){
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
  JOIN employee manager
    ON manager.id = employee.manager_id`

  connection.query(query,(err, res)=>{
    if(err)throw err;
    const employeeChoices = res.map(({ id, first_name, last_name }) => ({
      value: id,
      name: `${first_name} ${last_name}`      
    }));
    console.table(res);
    console.log("employeeChoices to Update!\n")
    updateRole(employeeChoices);
  });
}

function updateRole(employeeChoices){
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
  getUpdatedRole(employeeChoices, roleChoices);
});
}

function getUpdatedRole(employeeChoices, roleChoices) {
inquirer
  .prompt([
    {
      type: "list",
      name: "employee",
      message: `Employee who's role will be Updated: `,
      choices: employeeChoices
    },
    {
      type: "list",
      name: "role",
      message: "Select New Role: ",
      choices: roleChoices
    }

  ]).then((res)=>{
    let query = `UPDATE employee SET role_id = ? WHERE id = ?`
    connection.query(query,[ res.role, res.employee],(err, res)=>{
        if(err)throw err;
        genesis();
      });
  });
}