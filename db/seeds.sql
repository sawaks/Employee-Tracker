INSERT INTO department (department_name)
VALUES ("Sales"),
       ("Engineering"),
       ("Finance"),
       ("Legal");

INSERT INTO role (title, salary, department_id)
VALUES ("Sales Lead", 100000, 1),
       ("Salesperson", 8000, 1),
       ("Lead Engineer", 150000, 2),
       ("Software Engineer", 120000, 2),
       ("Acconut Manager", 160000, 3),
       ("Accountant", 125000, 3),
       ("Legal Team Lead", 250000, 4),
       ("Lawyer", 190000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Jimin", "Park", 1, NULL),
       ("Seokjin", "Smith", 2, 1),
       ("Jordan", "Pio", 3, NULL),
       ("Sawako", "Goshima", 4, 3),
       ("Jungkook", "Jeon", 5, NULL),
       ("Yoongi", "Min", 6, 5),
       ("Namjoon", "Kim", 7, NULL),
       ("Taehyung","Kim", 8, 7);