const mysql = require('mysql2');
const inquirer = require('inquirer');
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
                'View employees by manager',
                'View employees by department',
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update an employee role',
                'Delete department',
                'Delete role',
                'Delete employee',],

        },
    ])
    .then(answers => {
        selectOption(answers.options);

    });


function selectOption(options) {
    if (options) {
        switch (options) {
            case 'View all departments':
                const sql = 'SELECT id, department_name FROM department';
                return db.query(sql,
                    function (err, results) {
                        if (err) throw err;
                        console.table(results);
                        db.end();
                    });

            case 'View all roles':
                const sql2 = `SELECT role.id, title, department_name, salary
                                FROM role 
                                INNER JOIN department 
                                ON department.id = role.department_id`;
                return db.query(sql2, function (err, results) {
                    if (err) throw err;
                    console.table(results);
                    db.end();
                });

            case 'View all employees':
                const sql3 = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.department_name, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager 
                                FROM employee 
                                INNER JOIN role 
                                ON employee.role_id = role.id 
                                INNER JOIN department 
                                ON role.department_id = department.id 
                                LEFT JOIN employee manager 
                                ON employee.manager_id = manager.id`;
                return db.query(sql3, function (err, results) {
                    if (err) throw err;
                    console.table(results);
                    db.end();
                });

            case 'View employees by manager':
                return inquirer.prompt({
                    type: 'list',
                    name: 'categorisedByManager',
                    message: 'Choose by which manager?',
                    choices: function () {
                        return new Promise(function (resolve, reject) {
                            db.query(`SELECT 
                                        DISTINCT CONCAT(manager.first_name, ' ', manager.last_name) AS manager 
                                        FROM employee JOIN employee manager 
                                        ON employee.manager_id = manager.id`,
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
                })
                    .then(answers => {
                        const sql = `SELECT id FROM employee WHERE CONCAT(first_name, ' ',last_name) LIKE ?`;
                        db.query(sql, [answers.categorisedByManager],
                            function (err, results1) {
                                if (err) throw err;
                                if (results1) {
                                    const sql = `SELECT CONCAT(employee.first_name, ' ', employee.last_name) AS employee 
                                                FROM employee 
                                                WHERE manager_id = ?`;
                                    db.query(sql, [results1[0].id],
                                        function (err, results2) {
                                            if (err) throw err;
                                            if (results2) {
                                                console.table(results2);
                                                db.end();

                                            }
                                        });

                                }
                            });
                    });

            case 'View employees by department':
                return inquirer.prompt([
                    {
                        type: 'list',
                        name: 'categorisedByDepartment',
                        message: 'By which department?',
                        choices: function () {
                            return new Promise(function (resolve, reject) {
                                const sql = 'SELECT department_name FROM department';
                                db.query(sql, function (err, results) {
                                    if (err) {
                                        reject(err);
                                    } else {
                                        let departments = results.map(result => (result.department_name));
                                        resolve(departments);
                                    }
                                });
                            });
                        }
                    }
                ])
                    .then(answers => {
                        const spl = `SELECT CONCAT(employee.first_name, ' ', employee.last_name) AS employee
                                        FROM employee 
                                        INNER JOIN role 
                                        ON employee.role_id = role.id 
                                        INNER JOIN department 
                                        ON role.department_id = department.id 
                                        WHERE department_name = ?`;
                        db.query(spl, [answers.categorisedByDepartment],
                            function (err, results) {
                                if (err) throw err;
                                if (results) {
                                    console.table(results);
                                    db.end();

                                }
                            })
                    });


            case 'Add a department':
                return inquirer.prompt({
                    type: 'input',
                    name: 'newDepartment',
                    message: 'What is the name of the department?',
                })
                    .then(answers => {
                        const sql = 'INSERT INTO department(department_name) VALUES (?)';
                        db.query(sql, [answers.newDepartment],
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
                            const sql = 'SELECT id, department_name FROM department';
                            db.query(sql, function (err, results) {
                                if (err) {
                                    reject(err);
                                } else {
                                    let departments = results.map(result => (result.department_name));
                                    resolve(departments);
                                }
                            });
                        });
                    }
                }])
                    .then(answers => {
                        console.log(answers);
                        const spl = `SELECT id FROM department WHERE department_name = ?`;
                        db.query(spl, [answers.belongToDepartment],
                            function (err, results) {
                                if (err) throw err;
                                if (results) {
                                    const spl = 'INSERT INTO role(title, salary, department_id) VALUES (?, ?, ?)';
                                    db.query(spl, [answers.newRole, answers.newSalary, results[0].id],
                                        function (err, results) {
                                            if (err) throw err;
                                            if (results) {
                                                console.log('Success to add new role name and salary.');
                                                db.end();
                                            }
                                        });

                                }
                            })
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
                            db.query(`SELECT DISTINCT CONCAT(manager.first_name, ' ', manager.last_name) AS manager 
                                        FROM employee 
                                        JOIN employee manager 
                                        ON employee.manager_id = manager.id`,
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
                        db.query('SELECT id FROM role WHERE title = ?',
                            [answers.belongToRole],
                            function (err, results1) {
                                if (err) throw err;
                                if (results1) {

                                    db.query(`SELECT id FROM employee WHERE CONCAT(first_name, ' ',last_name) LIKE ?`,
                                        [answers.belongToManager],
                                        function (err, results2) {
                                            if (err) throw err;
                                            if (results2) {
                                                db.query('INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)',
                                                    [answers.newFirstName, answers.newLastName, results1[0].id, results2[0].id],
                                                    function (err, results) {
                                                        if (err) throw err;
                                                        if (results) {
                                                            console.log('Success to add new employee.');
                                                            db.end();
                                                        }
                                                    });
                                            }
                                        });
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
                        db.query(`SELECT id FROM employee WHERE CONCAT(first_name, ' ',last_name) LIKE ?`,
                            [answers.emplyeeAll],
                            function (err, results1) {
                                if (err) throw err;
                                if (results1) {
                                    db.query('SELECT id FROM role WHERE title = ?',
                                        [answers.belongToRole],
                                        function (err, results2) {
                                            if (err) throw err;
                                            if (results2) {
                                                db.query('SELECT manager_id FROM employee WHERE role_id = ?',
                                                    [results2[0].id],
                                                    function (err, results3) {
                                                        if (err) throw err;
                                                        if (results3) {
                                                            db.query(`UPDATE employee SET role_id = ${results2[0].id}, manager_id = ${results3[0].manager_id} WHERE id = ${results1[0].id}`,
                                                                function (err, results) {
                                                                    if (err) throw err;
                                                                    if (results) {
                                                                        console.log(`Success to update the emplyee's role.`);
                                                                        db.end();
                                                                    }
                                                                });
                                                        }
                                                    })

                                            }
                                        })

                                }
                            })



                    });
            case 'Delete department':
                return inquirer.prompt([{
                    type: 'list',
                    name: 'deleteDepartment',
                    message: 'Which department do you delete?',
                    choices: function () {
                        return new Promise(function (resolve, reject) {
                            const sql = 'SELECT id, department_name FROM department';
                            db.query(sql, function (err, results) {
                                if (err) {
                                    reject(err);
                                } else {
                                    let departments = results.map(result => (result.department_name));
                                    resolve(departments);
                                }
                            });
                        });
                    }
                }])
                    .then(answers => {
                        const spl = `SELECT id FROM department WHERE department_name = ?`;
                        db.query(spl, [answers.deleteDepartment],
                            function (err, results) {
                                if (err) throw err;
                                if (results) {
                                    const spl = 'DELETE FROM department WHERE id = ?';
                                    db.query(spl, [results[0].id],
                                        function (err, results) {
                                            if (err) throw err;
                                            if (results) {
                                                console.log(`Success to delete ${answers.deleteDepartment}.`);
                                                db.end();
                                            }
                                        });

                                }
                            })
                    });

            default:
                return '';
        }
    } else {
        return '';
    }
}

