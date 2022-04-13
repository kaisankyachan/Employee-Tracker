USE employee_trackerDB;

INSERT INTO department (name)
VALUES 
("Customer Support"), 
("Engineering"), 
("Marketing"), 
("Sales");

INSERT INTO role (title, salary, department_id)
VALUES 
("Support Manager", 80000, 1), 
("Tier 1 Support", 60000, 1), 
("Engineer Manager", 150000, 2), 
("Jr Software Engineer", 80000, 2), 
("Graphics Designer", 110000, 3), 
("Sales Manager", 1750000, 4), 
("Sales Associate", 90000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
("Kirigaya", "Kazuto", 2, 7), 
("Yuuki", "Asuna", 5, NULL), 
("Konno", "Yuuki", 6, NULL),
("Kirigaya", "Suguha", 5, NULL), 
("Asada", "Shino", 2, 7), 
("Nochizawa", "Eiji", 4, 8), 
("Tsuboi", "Ryoutarou", 1, NULL), 
("Kayaba", "Akihiko", 3, NULL), 
("Ayano", "Keiko", 7, 3); 