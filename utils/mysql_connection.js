


const mysql = require('mysql');
const connection = mysql.createPool(
    {
        host: "localhost",
        user: 'root',
        password: "root",
        database: "college",
       // timezone: 'local'
    }
)


module.exports=connection;