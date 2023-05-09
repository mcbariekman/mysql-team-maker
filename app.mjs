//demonstrates tecnical acceptance critera using inquirer package and mysql2 
import inquirer from 'inquirer';
import mysql from 'mysql2';


const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '120399',
  database: 'company_db'
});

connection.connect(err => {
  if (err) throw err;
  console.log('Connected to database.');
});


function promptUser() {
  return inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        'View all departments',
        'View all roles',
        'View all employees',
        'Add a department',
        'Add a role',
        'Add an employee',
        'Update an employee role',
        'Exit'
      ]
    }
  ]);
}
function start() {
    promptUser().then(answer => {
      switch (answer.action) {
        case 'View all departments':
          viewAllDepartments();
          break;
        case 'View all roles':
          viewAllRoles();
          break;
        case 'View all employees':
          viewAllEmployees();
          break;
        case 'Add a department':
          addDepartment();
          break;
        case 'Add a role':
          addRole();
          break;
        case 'Add an employee':
          addEmployee();
          break;
        case 'Update an employee role':
          updateEmployeeRole();
          break;
        case 'Exit':
          connection.end();
          break;
      }
    });
  }
  
  function viewAllDepartments() {
    connection.query('SELECT * FROM departments', (err, results) => {
      if (err) throw err;
  
      console.table(results); //prints to terminal and demonstrates technical acceptance criteria 
      start();
    });
  }
  
  function viewAllRoles() {
    connection.query(
      `SELECT roles.id, roles.title, departments.name AS department, roles.salary FROM roles JOIN departments ON roles.department_id = departments.id`,
      (err, results) => {
        if (err) throw err;
  
        console.table(results);
        start();
      }
    );
  }
  
  function viewAllEmployees() {
    connection.query(
      `SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.name AS department, roles.salary, CONCAT(managers.first_name, ' ', managers.last_name) AS manager
      FROM employees
      JOIN roles ON employees.role_id = roles.id
      JOIN departments ON roles.department_id = departments.id
      LEFT JOIN employees AS managers ON employees.manager_id = managers.id`,
      (err, results) => {
        if (err) throw err;
  
        console.table(results);
        start();
      }
    );
  }
  
  function addDepartment() {
    inquirer
      .prompt([
        {
          type: 'input',
          name: 'name',
          message: 'What is the name of the new department?'
        }
      ])
      .then(answer => {
        connection.query(
          'INSERT INTO departments SET ?',
          { name: answer.name },
          (err, results) => {
            if (err) throw err;
  
            console.log(`Added department "${answer.name}" to database.`);
            start();
          }
        );
      });
  }
  
  function addRole() {
    connection.query('SELECT * FROM departments', (err, departments) => {
      if (err) throw err;
  
      const departmentChoices = departments.map(department => ({
        name: department.name,
        value: department.id
      }));
  
      inquirer
        .prompt([
          {
            type: 'input',
            name: 'title',
            message: 'What is the title of the new role?'
          },
          {
            type: 'input',
            name: 'salary',
            message: 'What is the salary of the new role?'
          },
          {
            type: 'list',
            name: 'department_id',
            message: 'Which department does the new role belong to?',
            choices: departmentChoices
          }
        ])
        .then(answer => {
          connection.query(
            'INSERT INTO roles SET ?',
            {
              title: answer.title,
              salary: answer.salary,
              department_id: answer.department_id
            },
            (err, results) => {
              if (err) throw err;
  
              console.log(`Added role "${answer.title}" to database.`);
              start();
            }
          );
        });
    });
  }
  
            function addEmployee() {
                connection.query('SELECT * FROM roles', (err, roles) => {
                  if (err) throw err;
              
                  const roleChoices = roles.map(role => ({
                    name: role.title,
                    value: role.id
                  }));
              
                  connection.query('SELECT * FROM employees', (err, employees) => {
                    if (err) throw err;
              
                    const managerChoices = employees.map(employee => ({
                      name: `${employee.first_name} ${employee.last_name}`,
                      value: employee.id
                    }));
              
                    managerChoices.unshift({ name: 'None', value: null });
              
                    inquirer
                      .prompt([
                        {
                          type: 'input',
                          name: 'first_name',
                          message: "What is the employee's first name?"
                        },
                        {
                          type: 'input',
                          name: 'last_name',
                          message: "What is the employee's last name?"
                        },
                        {
                          type: 'list',
                          name: 'role_id',
                          message: "What is the employee's role?",
                          choices: roleChoices
                        },
                        {
                          type: 'list',
                          name: 'manager_id',
                          message: "Who is the employee's manager?",
                          choices: managerChoices
                        }
                      ])
                      .then(answer => {
                        connection.query(
                          'INSERT INTO employees SET ?',
                          {
                            first_name: answer.first_name,
                            last_name: answer.last_name,
                            role_id: answer.role_id,
                            manager_id: answer.manager_id
                          },
                          (err, results) => {
                            if (err) throw err;
              
                            console.log(`Added employee "${answer.first_name} ${answer.last_name}" to database.`);
                            start();
                          }
                        );
                      });
                  });
                });
              }
              
              function updateEmployeeRole() {
                connection.query('SELECT * FROM employees', (err, employees) => {
                  if (err) throw err;
              
                  const employeeChoices = employees.map(employee => ({
                    name: `${employee.first_name} ${employee.last_name}`,
                    value: employee.id
                  }));
              
                  connection.query('SELECT * FROM roles', (err, roles) => {
                    if (err) throw err;
              
                    const roleChoices = roles.map(role => ({
                      name: role.title,
                      value: role.id
                    }));
              
                    inquirer
                      .prompt([
                        {
                          type: 'list',
                          name: 'employee_id',
                          message: "Which employee's role do you want to update?",
                          choices: employeeChoices
                        },
                        {
                          type: 'list',
                          name: 'role_id',
                          message: 'Which role do you want to assign to the selected employee?',
                          choices: roleChoices
                        }
                      ])
                      .then(answer => {
                        connection.query(
                          'UPDATE employees SET role_id = ? WHERE id = ?',
                          [answer.role_id, answer.employee_id],
                          (err, results) => {
                            if (err) throw err;
              
                            console.log(`Updated employee's role.`);
                            start();
                          }
                        );
                      });
                  });
                });
              }
              
              start();
              