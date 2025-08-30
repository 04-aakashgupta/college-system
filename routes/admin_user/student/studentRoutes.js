const express = require("express");
const router = express.Router();
const connection = require('../../../utils/mysql_connection');



// admin student routes start


router.get("/view", (req, res) => {

    const query = `select student_id,student_name,student_gender,student_city,student_email,student_age,student_age,batch_name,course_name
                   from 
                   student 
                   join 
                   course 
                   on student.course_id=course.course_id
                   left  join
                   batch 
                   on
                   student.batch_id=batch.batch_id
                   `;

    connection.query(query, (err, result) => {
        if (err) throw err;
        console.log(result);

        res.render('admin_user/student/view.ejs', { student_data: result });


    })



})








module.exports = router;