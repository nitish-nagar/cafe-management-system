
# Cafe Management System

Café Management System is a Web App that has been created to provide a solution for a café/food-chain restaurant which operates like McDonald’s and it will enable the person on the counter (server) to accept orders from customer and post that the admin can view entire order history and can also search/filter through thems. 

The Admin can manage which employees (servers) are on duty on a given day and view all order history and bills of each and every order. They also can add items to the restaurant menu using the system and can also disable any menu item once it is actually out of stock. Servers only have access to place orders and view bills.

Developed in Node.js, Express.js, MySQL, RESTful API, Angular 11 and EJS (Template Engine)

Followed this great tutorial for building the entire project: https://www.youtube.com/watch?v=SqSN6sqbdMQ


## Installation

### Using Git ###
1. Clone the project from github. Change "myproject" to your project name.

```bash
  git clone https://github.com/nitish-nagar/cafe-management-system.git ./myproject
```

2. Install npm dependencies, set up environments and execute the frontend

```bash
  cd myproject/frontend
  npm install
  ng serve
```

To access the frontend, visit http://localhost:4200

3. Install npm dependencies, set up environments and execute the backend

```bash
  cd myproject/backend-cafe-nodejs
  npm install
  touch .env
```

NOTE: You will need to add the following environment variables:

NODE_WEB_PORT=8080 (example)

DB_PORT, DB_HOST, DB_USER, DB_PASS, DB_NAME, ACCESS_TOKEN, EMAIL_USER, EMAIL_PASS, USER in the .env file

```bash
  npm start
```

To access the frontend, visit http://localhost:8080
## Authors

- [Pradeepraj Nadar](https://github.com/Pradeepraj21)
- [Nitish Nagar](https://github.com/nitish-nagar)

