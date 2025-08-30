const express = require('express');
const connection = require('./utils/mysql_connection');
const session = require("express-session")
const cookie_parser = require('cookie-parser');
const ejs = require('ejs');
const path = require('path')
const adminRoutes = require('./routes/admin_user/admin-userRoutes');
const allUserRouteRoutes = require('./routes/all_user/allUserRoute')
const app = express();



app.use(express.json());
app.use(express.urlencoded({ extends: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use(session({ secret: "xyz", resave: false, saveUninitialized: false }))
app.use(cookie_parser());
app.use(express.static('public'));
app.use('/admin-user', adminRoutes)
app.use('/all-user', allUserRouteRoutes)

const data={name:"aakash",age:20};
const data1={...data};














app.listen(3000);

console.log("server listen on port 3000");
console.log("http://localhost:3000/");
