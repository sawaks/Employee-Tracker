// const fs = require('fs');
const express = require('express');
const mysql = require('mysql2');
const inquirer = require('inquirer');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const db = mysql.createConnection(
    {
        host: '127.0.0.1',
        user: 'root',
        password: 'goshiko',
        database: 'employee_db'
    },
    console.log(`Connected to the employee_db database.`)
);

inquirer
    .prompt([
        {
            type: 'list',
            name: 'options',
            message: 'What would you like to do?',
            choices: ['View all departments',
                'View all roles',
                'View all employees',
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update an employee role'],

        },
    ])
    .then(answers => {
        renderOption(answers.options);

    });


function renderOption(options) {
    if (options) {
        switch (options) {
            case 'View all departments':
                return db.query('SELECT id, department_name FROM department',
                    function (err, results) {
                        if (err) throw err;
                        console.table(results);
                        db.end();
                    });

            case 'View all roles':
                return db.query('SELECT role.id, title, department_name, salary FROM role INNER JOIN department ON department.id = role.department_id',
                    function (err, results) {
                        if (err) throw err;
                        console.table(results);
                        db.end();
                    });

            case 'View all employees':
                return db.query(`SELECT employee.id, employee.first_name, employee.last_name, role.title, department.department_name, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id LEFT JOIN employee manager ON employee.manager_id = manager.id`,
                    function (err, results) {
                        if (err) throw err;
                        console.table(results);
                        db.end();
                    });

            case 'Add a department':
                return inquirer.prompt({
                    type: 'input',
                    name: 'newDepartment',
                    message: 'What is the name of the department?',
                })
                    .then(answers => {
                        db.query('INSERT INTO department(department_name) VALUES (?)', [answers.newDepartment],
                            function (err, results) {
                                if (err) throw err;
                                if (results) {
                                    console.log('Success to add new department name.');
                                    db.end();
                                }
                            });
                    });

            case 'Add a role':
                return inquirer.prompt([{
                    type: 'input',
                    name: 'newRole',
                    message: 'What is the name of the role?'
                },
                {
                    type: 'input',
                    name: 'newSalary',
                    message: 'What is the salary of the role?'
                },
                {
                    type: 'list',
                    name: 'belongToDepartment',
                    message: 'Which department belong to?',
                    choices: function () {
                        return new Promise(function (resolve, reject) {
                            db.query('SELECT department_name FROM department',
                                function (err, results) {
                                    if (err) {
                                        reject(err);
                                    } else {
                                        let departments = results.map(result => result.department_name);
                                        resolve(departments);
                                    }
                                });
                        });
                    }
                }
                ])
                    .then(answers => {
                        db.query('INSERT INTO role(title, salary, department_id) VALUES (?, ?, ?)', [answers.newRole, answers.newSalary, answers.belongToDepartment],
                            function (err, results) {
                                if (err) throw err;
                                if (results) {
                                    console.log('Success to add new role name and salary.');
                                    db.end();
                                }
                            });
                    });

            case 'Add an employee':
                return inquirer.prompt([{
                    type: 'input',
                    name: 'newFirstName',
                    message: 'What is the first name of new emplyee?'
                },
                {
                    type: 'input',
                    name: 'newLastName',
                    message: 'What is the last name of new emplyee?'
                },
                {
                    type: 'list',
                    name: 'belongToRole',
                    message: 'Which role belong to?',
                    choices: function () {
                        return new Promise(function (resolve, reject) {
                            db.query('SELECT title FROM role', function (err, results) {
                                if (err) {
                                    reject(err);
                                } else {
                                    let titles = results.map(result => result.title);
                                    resolve(titles);
                                }
                            });
                        });
                    }
                },
                {
                    type: 'list',
                    name: 'belongToManager',
                    message: 'Which manager belong to?',
                    choices: function () {
                        return new Promise(function (resolve, reject) {
                            db.query(`SELECT CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee JOIN employee manager ON employee.manager_id = manager.id`,
                                function (err, results) {
                                    if (err) {
                                        reject(err);
                                    } else {
                                        let managers = results.map(result => result.manager);
                                        resolve(managers);
                                    }
                                });
                        });
                    }
                },
                ])
                    .then(answers => {
                        db.query('INSERT INTO role(title, salary, department_name) VALUES (?, ?, ?)', [answers.newRole, answers.newSalary, answers.belongToDepartment], function (err, results) {
                            if (err) throw err;
                            if (results) {
                                console.log('Success to add new role name and salary.');
                                db.end();
                            }
                        });
                    });


            case 'Update an employee role':
                return inquirer.prompt([{
                    type: 'list',
                    name: 'emplyeeAll',
                    message: `Which emplyee's role do you want update?`,
                    choices: function () {
                        return new Promise(function (resolve, reject) {
                            db.query(`SELECT CONCAT(employee.first_name, ' ', employee.last_name) AS employee FROM employee`,
                                function (err, results) {
                                    if (err) {
                                        reject(err);
                                    } else {
                                        let employees = results.map(result => result.employee);
                                        resolve(employees);
                                    }
                                });
                        });
                    }
                },
                {
                    type: 'list',
                    name: 'belongToRole',
                    message: 'Which role belong to?',
                    choices: function () {
                        return new Promise(function (resolve, reject) {
                            db.query('SELECT title FROM role', function (err, results) {
                                if (err) {
                                    reject(err);
                                } else {
                                    let titles = results.map(result => result.title);
                                    resolve(titles);
                                }
                            });
                        });
                    }
                },
                ])
                    .then(answers => {
                        db.query('INSERT INTO role(title, salary,  department_name) VALUES (?, ?, ?)', [answers.newRole, answers.newSalary, answers.belongToDepartment], function (err, results) {
                            if (err) throw err;
                            if (results) {
                                console.log('Success to add new role name and salary.');
                                db.end();
                            }
                        });
                    });

            default:
                return '';
        }
    } else {
        return '';
    }
}


app.use((req, res) => {
    res.status(404).end();
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
