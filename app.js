require('dotenv').config();
const express = require('express');
const connection = require('./utils/mysql_connection');
const session = require("express-session");
const cookie_parser = require('cookie-parser');
const path = require('path');
const adminRoutes = require('./routes/admin_user/admin-userRoutes');
const allUserRouteRoutes = require('./routes/all_user/allUserRoute');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(cookie_parser());

app.use(session({
    secret: process.env.SESSION_SECRET || 'default-secret',
    resave: false,
    saveUninitialized: false
}));

app.use(express.static('public'));
app.use('/admin-user', adminRoutes);
app.use('/all-user', allUserRouteRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
