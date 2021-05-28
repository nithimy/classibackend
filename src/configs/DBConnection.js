// require('dotenv').config();
import mysql from "mysql2";
const mysql = require("mysql");

let connection = mysql.createConnection({
    host: "us-cdbr-east-03.cleardb.com",
    user: "b57d3e74fb8377",
    password: "7fad4843",
    database: "heroku_68878ccdd651069"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("Database connected!");
});

module.exports = connection;

// mysql://b57d3e74fb8377:7fad4843@us-cdbr-east-03.cleardb.com/heroku_68878ccdd651069?reconnect=true