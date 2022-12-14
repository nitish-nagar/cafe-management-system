const mysql = require('mysql');

require('dotenv').config();

let connection = mysql.createConnection(
    {
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        port: process.env.DB_PORT,
    }
);

connection.connect((err)=>{
    if(err) {
        console.log(`Error while connecting to MySQL - ${err}`);
        throw err;
    }
    console.log("Database Connection established!");
});


module.exports=connection;