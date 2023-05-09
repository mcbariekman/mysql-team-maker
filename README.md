# Employee Tracker

> This is a command-line application that allows a user to manage employees, departments, and roles in a company database. It uses Node.js and MySQL to execute CRUD (create, read, update, delete) operations on the database.

## Installation

1. Clone this repository to your local machine.
2. Navigate to the project directory in your terminal.
3. Run `npm install` to install the required dependencies.
4. Create a database in MySQL using the schema and seed data provided in the `db` folder. You can do this by running the following commands in your terminal:

```
mysql -u root -p
CREATE DATABASE company_db;
USE company_db;
SOURCE db/schema.sql;
SOURCE db/seeds.sql;
```

## Usage

> To run the application, navigate to the project directory in your terminal and run the command `npm start`.

You will be presented with a menu of options that allow you to view, add, and update data in the database. Here are the available options:

- View all departments
- View all roles
- View all employees
- Add a department
- Add a role
- Add an employee
- Update an employee role
- Exit

Selecting an option will execute the corresponding function and display the results in a formatted table in the terminal. For example, selecting "View all departments" will display a table of all the departments in the company.

## Walkthrough

[SQL Employee Tracker](https://youtu.be/GxxAj8kmn3E)

## License

This project is licensed under the terms of the [MIT License](https://opensource.org/licenses/MIT).