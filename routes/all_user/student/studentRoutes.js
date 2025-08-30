const express = require('express');
const connection = require('../../../utils/mysql_connection');
const session = require('express-session');
const router = express.Router();


//databse start



router.get("/update", (req, res) => {

    const query = "select * from course";
    connection.query(query, (err, result) => {
        if (err) {
            console.log("course query error" + err);
            return res.status(502).send(`<script>alert('Internal server error');window.location.href='/admin-user/student/view';</script>`)
        }
        else if (result.length > 0) {
            console.log(result);

            return res.render('all_user/student/update.ejs', { courses: result });
        }
        else {
            return res.status(404).send(`<script>alert('No courses found');window.location.href='/admin-user/student/view';</script>`)
        }
    })

})



router.get("/register", (req, res) => {

    const query = "select * from course";
    connection.query(query, (err, result) => {
        if (err) {
            console.log("course query error" + err);
            return res.status(502).send(`<script>alert('Internal server error');window.location.href='/admin-user/student/view';</script>`)
        }
        else if (result.length > 0) {
            console.log(result);

            return res.render('all_user/student/register.ejs', { courses: result });
        }
        else {
            return res.status(404).send(`<script>alert('No courses found');window.location.href='/admin-user/student/view';</script>`)
        }
    })

})

router.post("/register-request", (req, res) => {



    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const age = req.body.age;
    const gender = req.body.gender;
    const city = req.body.city;
    const course_id = req.body.student_course_id;
    console.log(name, email, password, age, gender, city, course_id)




    const user_inert_query = "insert into user(user_email,user_password,user_type)  values(?,?,'student')";
    connection.query(user_inert_query, [email, password], (err, result) => {
        if (err) {
            console.log("user_insert_query error" + err);

            return res.status(502).send(`<script>alert('Internal server error');window.location.href='/admin-user/register';</script>`)

        }

        else if (result.affectedRows === 1) {
             const userId = result.insertId

            const query = `insert into student(student_name,student_gender,student_city,student_email,student_age,course_id,user_id) values('${name}','${gender}','${city}','${email}',${age},${course_id},${userId})`;
            connection.query(query, (err, result) => {
                if (err) {
                    console.log("insert student error:" + err);
                    return res.status(502).send(`<script>alert('Internal server error');window.location.href='/admin-user/student/register';</script>`)

                }

                else if (result.affectedRows === 1) {



                    return res.send(`<script>alert('successfully student registred');window.location.href='/admin-user/student/view';</script>`)


                }
                else {
                    return res.send(`<script>alert('something went wrong');window.location.href='/admin-user/student/register';</script>`)

                }

            })

        }


        else {

            return res.send(`<script>alert('something went wrong');window.location.href='/admin-user/student/register';</script>`)

        }
    })

})


router.post("/update-request", (req, res) => {


    const id = req.body.id;
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const age = req.body.age;
    const gender = req.body.gender;
    const city = req.body.city;
    const course_id = req.body.student_course_id;

    console.log(name, email, password, age, gender, city, course_id)






    const query = `update student inner join user on student.user_id=user.user_id 
    set student_name= '${name}', student_gender='${gender}',student_city='${city}',student_email='${email}',student_age='${age}',course_id=${course_id},user_email='${email}',user_password='${password}'
    where student_id=${id}` ;   
    connection.query(query, (err, result) => {
        if (err) {
            console.log("update student error:" + err);
            return res.status(502).send(`<script>alert('Internal server error');window.location.href='/all-user/student/update';</script>`)

        }

        else if (result.affectedRows === 2) {



            return res.send(`<script>alert('successfully student updated');window.location.href='/admin-user/student/view';</script>`)


        }

        else if (result.affectedRows === 0) {
            return res.send(`<script>alert('record not found');window.location.href='/all-user/student/update';</script>`)

        }
        else {
            console.log("update student issue:" , result);
            return res.send(`<script>alert('something went wrong');window.location.href='/all-user/student/update';</script>`)

        }

    })




})


// router.post("/delete-request", (req, res) => {
//     const id = req.body.sid;

//     const query = `
//         DELETE user,student
//         FROM student
//         INNER JOIN user ON student.user_id = user.user_id
//         WHERE student.student_id = ?;
//     `;

//     connection.query(query, [id], (err, result) => {
//         if (err) {
//             console.error("Error deleting records:", err);
//             return res.status(500).send("Error deleting records");
//         }
//         res.redirect("/admin");
//     });
// });



// router.get("/delete", (req, res) => {


//         return res.sendFile(__dirname + '/delete.html')

   

// })


//database end

module.exports = router;