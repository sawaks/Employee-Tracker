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
VALUES ("Jimin", "Park", 1, 1),
       ("Seokjin", "Smith", 2, NULL),
       ("Jordan", "Pio", 3, 3),
       ("Sawako", "Goshima", 4, NULL),
       ("Jungkook", "Jeon", 5, 5),
       ("Yoongi", "Min", 6, NUll),
       ("Namjoon", "Kim", 7, 7),
       ("Taehyung","Kim", 8, NULL);