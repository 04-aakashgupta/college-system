

require('dotenv').config();

const mysql = require('mysql');
const connection = mysql.createPool(
    {
        host:process.env.DBHOST,
        user:process.env.DB_USER,
        password: process.env.DB_PASS,
        database:process.env.DB_NAME,
    
    }
)


module.exports=connection;