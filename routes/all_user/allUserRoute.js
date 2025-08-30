const express = require('express');
const connection = require('../../utils/mysql_connection')
// const app=express();
const router = express.Router();
const studentRoutes = require('./student/studentRoutes')
// const batchRoutes = require("./batch/studentBatch");
// const courseRoutes = require("./course/courseRoutes");
//const session = require('express-session');

router.use("/student", studentRoutes);
// router.use('/batch', batchRoutes);
// router.use('/', courseRoutes);



router.post("/login-request", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    // let render=false;
    console.log(email, password);


    connection.query(`select * from user where user_email='${email}'  `, (err, result) => {
        console.log(result);

        if (err) {

            console.log(err)
            return res.send(`<script>alert(" 502 server error");
                 window.location.href="${redirect}"</script>`);
        }



        else if (result) {


            if (result.length > 0) 
                {

                console.log(result)

                if (password === result[0].user_password) {
                    res.cookie("user_email", result[0].user_email)
                    res.cookie("user_type", result[0].user_type)

                    if (result[0].user_type === "student") {
                        const student_data_query = "select * from student where student_email=?";
                        connection.query(student_data_query, [result[0].user_email], (err) => {
                            if (err)
                                 {
                                console.log("user_data_query error:", err, result)
                            }

                        else if (result.length > 0) {
                                res.cookie("user_name", result[0].student_name)
                                return res.send(`<script>alert("Login Successfully");
                               window.location.href="/student"</script > `);
                            }

                        })
                    }

                    else if (result[0].user_type === "admin") {
                        res.cookie("user_name", "admin")
                        return res.redirect("/admin-user/")
                    }


                    else
                    {
                     return res.send(`<script> alert('something  went wrong');
                            window.location.href ='/login.html' </script > `);
                    }

                }


                else
                {

                     return res.send(`<script> alert('Invalid Credentials');
                            window.location.href = '/login.html' </script >`);

                }






            }

            else {

                console.log("sjfg")
                return res.send(`<script> alert('No record found first register record');
                            window.location.href = '/login.html'</script > `);

            }
        }






        else {

            return res.send(`<script> alert('something  went wrong');
                            window.location.href ='/login.html' </script > `);

        }




    })


})





module.exports = router;