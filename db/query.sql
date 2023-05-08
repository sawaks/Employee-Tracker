SELECT role.id, title, department_name, salary
FROM role
INNER JOIN department
ON department.id = role.department_id;

SELECT 
employee.id, 
employee.first_name, 
employee.last_name, 
role.title, 
department.department_name, 
role.salary, 
CONCAT(manager.first_name, ' ', manager.last_name) AS manager 
FROM employee 
INNER JOIN role 
ON employee.role_id = role.id 
INNER JOIN department 
ON role.department_id = department.id 
LEFT JOIN employee manager 
ON employee.manager_id = manager.id;

SELECT 
DISTINCT CONCAT(manager.first_name, ' ', manager.last_name) AS manager 
FROM employee 
JOIN employee manager 
ON employee.manager_id = manager.id;

SELECT 
CONCAT(employee.first_name, ' ', employee.last_name) AS employee
FROM employee ;



SELECT id
FROM employee
WHERE CONCAT(first_name, ' ',last_name) LIKE 'Jimin Park';

SELECT first_name , manager_id 
FROM employee;


SELECT id, manager_id
FROM employee 
WHERE role_id = 2;

SELECT manager_id FROM employee;

SELECT CONCAT(employee.first_name, ' ', employee.last_name) AS employee
FROM employee 
WHERE manager_id = 3;

SELECT CONCAT(employee.first_name, ' ', employee.last_name) AS employee
FROM employee 
INNER JOIN role 
ON employee.role_id = role.id 
INNER JOIN department 
ON role.department_id = department.id 
WHERE department_name = "Sales";

-- DELETE 
-- FROM role 
-- WHERE title = "Sales lead";


-- DELETE 
-- FROM role 
-- WHERE title = "Salesperson";


SELECT employee.id, employee.first_name, employee.last_name, role.title, department.department_name, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager 
FROM employee 
LEFT JOIN role 
ON employee.role_id = role.id 
LEFT JOIN department 
ON role.department_id = department.id 
LEFT JOIN employee manager 
ON employee.manager_id = manager.id;

SELECT title
FROM role
WHERE department_id = 2;

SELECT DISTINCT manager_id
FROM employee
WHERE role_id = 2;

-- DELETE 
-- FROM employee
-- WHERE manager_id = 3;

SELECT employee.id, employee.first_name, employee.last_name, role.title, department.department_name, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager 
FROM employee 
LEFT JOIN role 
ON employee.role_id = role.id 
LEFT JOIN department 
ON role.department_id = department.id 
LEFT JOIN employee manager 
ON employee.manager_id = manager.id;

-- DELETE 
-- FROM role
-- WHERE id = 1;

SELECT employee.id, employee.first_name, employee.last_name, role.title, department.department_name, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager 
FROM employee 
LEFT JOIN role 
ON employee.role_id = role.id 
LEFT JOIN department 
ON role.department_id = department.id 
LEFT JOIN employee manager 
ON employee.manager_id = manager.id;

SELECT DISTINCT manager_id FROM employee WHERE role_id = 2;

SELECT * FROM role;

SELECT * FROM employee;