

const express = require('express');
// const app=express();
const router = express.Router();
const studentRoutes = require('./student/studentRoutes')
const batchRoutes = require("./batch/batchRoutes");
const courseRoutes = require("./course/courseRoutes");
const attendenceRoutes=require("./attendence/admin_attendenceRoutes")
//const session = require('express-session');
router.use("/student", studentRoutes);
router.use('/batch', batchRoutes);
router.use('/course', courseRoutes);
router.use("/attendence",attendenceRoutes)


router.get("/", (req, res) => {
                res.render("admin_user/adminHome.ejs", {user_name:req.cookies.user_name})
})






module.exports = router;