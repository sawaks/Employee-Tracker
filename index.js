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


function manu() {

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
                    'View the total utilized budget of a department',
                    'Add a department',
                    'Add a role',
                    'Add an employee',
                    'Update an employee role',
                    'Update employee managers',
                    'Delete department',
                    'Delete role',
                    'Delete employee',],

            },
        ])
        .then(answers => {
            selectOption(answers.options);

        });

}

function viewDepartments() {
    const sql = 'SELECT id, department_name FROM department';
    return db.query(sql,
        function (err, results) {
            if (err) throw err;
            if (results.length === 0) {
                console.log("Currently no department. Input department.")
            } else {
                console.table(results);
            }
            manu();
        })

}

function viewAllRoles() {
    const sql2 = `SELECT role.id, title, department_name, salary
    FROM role 
    INNER JOIN department 
    ON department.id = role.department_id`;
    return db.query(sql2, function (err, results) {
        if (err) throw err;
        if (results.length === 0) {
            console.log("Currently no role. Input role.")
        } else {
            console.table(results);
        }
        manu();
    });

}

function viewAllEmployees() {
    const sql3 = `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.department_name, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager 
    FROM employee 
    LEFT JOIN role 
    ON employee.role_id = role.id 
    LEFT JOIN department 
    ON role.department_id = department.id 
    LEFT JOIN employee manager 
    ON employee.manager_id = manager.id`;
    return db.query(sql3, function (err, results) {
        if (err) throw err;
        console.table(results);
        manu();
    });

}

function viewEmplyeesByManager() {
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

                                    manu();

                                }
                            });

                    }
                });
        });
}

function ViewEmployeesByDepartment() {
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
                        LEFT JOIN role 
                        ON employee.role_id = role.id 
                        LEFT JOIN department 
                        ON role.department_id = department.id 
                        WHERE department_name = ?`;
            db.query(spl, [answers.categorisedByDepartment],
                function (err, results) {
                    if (err) throw err;
                    if (results) {
                        console.table(results);

                        manu();

                    }
                })
        });
}

function addDepartment() {
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

                        manu();
                    }
                });
        });
}

function addRole() {
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

                                    manu();
                                }
                            });

                    }
                })
        });
}
function AddEmployee() {
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

                                                manu();
                                            }
                                        });
                                }
                            });
                    }
                });
        });
}
function updateEmployeeRole() {
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
                                    db.query(`UPDATE employee SET role_id = ${results2[0].id} WHERE id = ${results1[0].id}`,
                                        function (err, results) {
                                            if (err) throw err;
                                            if (results) {
                                                console.log(`Success to update the emplyee's role.`);

                                                manu();
                                            }
                                        });
                                }
                            })

                    }
                })

        });
}

function updateEmployeesManagers() {
    return inquirer.prompt([{
        type: 'list',
        name: 'emplyeeAll',
        message: `Which emplyee's manager do you want update?`,
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
            db.query(`SELECT id FROM employee WHERE CONCAT(first_name, ' ',last_name) LIKE ?`,
                [answers.emplyeeAll],
                function (err, results1) {
                    if (err) throw err;
                    if (results1) {
                        db.query(`SELECT id FROM employee WHERE CONCAT(first_name, ' ', last_name) LIKE ?`,
                            [answers.belongToManager],
                            function (err, results2) {
                                if (err) throw err;
                                if (results2) {
                                    db.query(`UPDATE employee SET manager_id = ${results2[0].id} WHERE id = ${results1[0].id}`,
                                        function (err, results) {
                                            if (err) throw err;
                                            if (results) {
                                                console.log(`Success to update the emplyee's manager.`);

                                                manu();
                                            }
                                        });
                                }
                            })

                    }
                })

        });
}
function deleteDepartment() {
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
                function (err, results1) {
                    if (err) throw err;
                    if (results1) {
                        const spl = 'DELETE FROM department WHERE id = ?';
                        db.query(spl, [results1[0].id],
                            function (err, results2) {
                                console.log("results2:", results2)
                                if (err) throw err;
                                console.log(`Success to delete ${answers.deleteDepartment}.`);

                                manu();
                            });

                    }
                })
        });
}

function deleteRole() {
    return inquirer.prompt([{
        type: 'list',
        name: 'deleteRole',
        message: 'Which role do you delete?',
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
    }])
        .then(answers => {
            const spl = `SELECT id FROM role WHERE title LIKE ?`;
            db.query(spl, [answers.deleteRole],
                function (err, results1) {
                    if (err) throw err;
                    if (results1) {
                        const spl = `DELETE FROM role WHERE id = ${results1[0].id}`;
                        db.query(spl,
                            function (err, results4) {
                                if (err) throw err;
                                if (results4) {
                                    console.log(`Success to delete ${answers.deleteRole}.`);

                                    manu();
                                }
                            }
                        )

                    }

                })
        });
}

function deleteEmployee() {
    return inquirer.prompt([{
        type: 'list',
        name: 'deleteEmployee',
        message: 'Which emplyee do you delete?',
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
    }])
        .then(answers => {
            const spl = `DELETE FROM employee WHERE CONCAT(employee.first_name, ' ', employee.last_name) LIKE ?`;
            db.query(spl, [answers.deleteEmployee],
                function (err, results) {
                    if (err) throw err;
                    if (results) {
                        console.log(`Success to delete ${answers.deleteEmployee}.`);

                        manu();
                    }
                })
        });
}

function selectOption(options) {
    if (options) {
        switch (options) {
            case 'View all departments':
                viewDepartments();
                break;

            case 'View all roles':
                viewAllRoles();
                break;

            case 'View all employees':
                viewAllEmployees();
                break;

            case 'View employees by manager':
                viewEmplyeesByManager();
                break;

            case 'View employees by department':
                ViewEmployeesByDepartment();
                break;

            case 'Add a department':
                addDepartment();
                break;

            case 'Add a role':
                addRole();
                break;

            case 'Add an employee':
                AddEmployee();
                break;

            case 'Update an employee role':
                updateEmployeeRole();
                break;

            case 'Update employee managers':
                updateEmployeesManagers();
                break;

            case 'Delete department':
                deleteDepartment();
                break;

            case 'Delete role':
                deleteRole();
                break;

            case 'Delete employee':
                deleteEmployee();
                break;

            default:
                return '';
        }
    } else {
        return '';
    }
}
manu();
