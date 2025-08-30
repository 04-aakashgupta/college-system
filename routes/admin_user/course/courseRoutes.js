const express = require('express');
const connection = require('../../../utils/mysql_connection');
const e = require('express');

const router = express.Router();


router.get('/register', (req, res) => {
    res.sendFile(__dirname + "/register.html")
})


router.get("/update", (req, res) => {
    res.sendFile(__dirname + "/update.html");
})

router.get("/delete", (req, res) => {
    res.sendFile(__dirname + "/delete.html");
})


router.get("/view", (req, res) => {


    const query = "select * from course";

    connection.query(query, (err, courses) => {

        if (err) {
            console.log("select error:" + err)
            return res.status(502).send("Internal Server Error")
        }


        else if (courses) {
            if (courses.length > 0) {

                return res.render('admin_user/course/view.ejs', { courses: courses })

            }


            else {
                return res.status(404).send("NO Entry found in Course Data")
            }

        }

        else {
            return res.status(502).send("something went wrong")
        }



    })





})

router.post("/register-request", (req, res) => {
    const course_name = req.body.course_name;

    console.log(course_name)




    const inserQuery = "insert into course(course_name) values(?)"
    connection.query(inserQuery, [course_name], (err, result) => {

        if (err) {
            console.log("insert error" + err);

            return res.status(502).send("Internal Servor Error");

        }



        if (result) {
            console.log(result);
            res.send("<h2>registration Successfully");
        }


        else {
            res.status(502).send("Internal Server Error");
        }
    })
})


router.post("/update-request", (req, res) => {
    const course_id = Number(req.body.course_id);
    const course_name = req.body.course_name;
    const course_update_query = "update course set course_name=? where course_id=?";

    connection.query(course_update_query, [course_name, course_id], (err, result) => {
        if (err) {
            console.log("update error:" + err);
            res.status(502).send("Internal Server Error");
        }
        else if (result === null || result === undefined) {
            res.status("404").send("Course Not Found")

        }
        else if (result !== null && result !== undefined) {

            res.send(`<script>alert('Course Updated')
                     window.location.href = '/admin-user/course/view' </script>`)
        }


        else {
            console.log("something went wrong", result);
            res.status(502).send("something went wrong");


        }


    })
})



router.post("/delete-request", (req, res) => {
    const course_id = req.body.course_id;
    const deleteQuery = "delete from course where course_id=?";
    connection.query(deleteQuery, [course_id], (err, result) => {
        if (err) {
            console.log("delete err:" + err);

            if (err.code === "ER_ROW_IS_REFERENCED_2") {
            return res.send(`<script>alert('first delete assigned batch');window.location.href='/admin-user/batch/view'</script>`)
            }
            return res.status(502).send("Internal Server Error")

        }

        else if (result.affectedRows === 1) {
            console.log(result, "condition 2")

            return res.send(`<script>alert('course deleted successfully');window.location.href='/admin-user/course/view'</script>`)
        }

        else if (result.affectedRows === 0) {
            console.log(result, "condition 3")
            return res.send(`<script>alert('record not found');window.location.href='/admin-user/course/view'</script>`)
        }

        else {
            console.log(result, "condition 4")
            return res.send(`<script>alert('something went wrong');window.location.href='/admin-user/course/delete'</script>`)

        }
    })
})



module.exports = router;