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
CONCAT(manager.first_name, ' ', manager.last_name) AS manager 
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

