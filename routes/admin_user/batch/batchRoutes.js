const express = require('express');
const connection = require("../../../utils/mysql_connection")

const router = express.Router();
const manage_student_batch=require("./manage-student-batch/manage-student-batch-routes");

router.use("/manage-student-batch",manage_student_batch);


//static page start

router.get('/register', (req, res) => {

    const fetch_course_name_query = 'select course_name from course';
    connection.query(fetch_course_name_query, (err, result) => {
        if (result) {
            if (result.length > 0) {
                return res.render("admin_user/batch/register.ejs", { result: result });

            }

            else {
                return res.status(404).send(`<script>alert('course not registered first register course');window.location.href='/admin/course/register';</script>`)
            }
        }
    })

})


router.get("/update", (req, res) => {

    const fetch_course_name_query = 'select course_name from course';
    connection.query(fetch_course_name_query, (err, result) => {
        if (result) {
            if (result.length > 0) {
                return res.render("admin_user/batch/update.ejs", { result: result });

            }

            else {
                return res.status(404).send(`<script>alert('course not registered first register course');window.location.href='/admin/course/register';</script>`)
            }
        }
    })

})

router.get('/delete', (req, res) => {
    res.sendFile(__dirname + "/delete.html");
})


//static page end

//database page start
router.get("/view", (req, res) => {



    connection.query("select  batch_id,batch_name,batch_start_date,batch_end_date,course_name  from  batch join course  on batch.course_id=course.course_id", (err, result) => {


        if (err) {

            console.log("fetch data from batch and course using join query error:" + err)
            return res.status(502).send("Internal Server Error");
        }


        else if (result) {

            console.log(result);

            if (result.length > 0) {





                return res.render('admin_user/batch/view.ejs', { batch_data: result })

            }


            else {
                return res.status(404).send(`<script>alert('data not found');window.location.href='/admin/batch/register';</script>`)

            }
        }

        else {
            return res.status(404).send(`<script>alert('something went erong');window.location.href='/admin';</script>`)

        }


    })
})



router.post("/register-request", (req, res) => {
    const batch_name = req.body.batch_name;
    const course_name = req.body.course_name;
    const batch_start_date = req.body.batch_start_date;
    const batch_end_date = req.body.batch_end_date;

    const course_id_search_query = "select course_id from course where course_name=?";
    connection.query(course_id_search_query, [course_name], (err, result) => {
        if (err) {
            console.log("course_id_search_query error:" + err)
            return res.status(502).send("Internal Server Error");
        }

        else if (result) {


            if (result.length > 0) {

                console.log(result[0].course_id)





                connection.query(`insert into  batch (batch_name,batch_start_date,batch_end_date,course_id) 
                         values
                    ('${batch_name}','${batch_start_date}','${batch_end_date}',${result[0].course_id})`, (err, result) => {
                    if (err) {
                        console.log("batch insert query error:" + err)
                        return res.status(502).send("Internal Server Error");
                    }
                    if (result) {
                        console.log("nsavjfhagshgjldfkgs,jgfj")
                        return res.send(`<script>alert('batch registred successgully');
                                window.location.href='/admin-user/batch/view';</script>`)
                    }

                });
            }

            else {
                return res.status(404).send(`<script>alert('course not found');window.location.href='/admin/batch/register';</script>`)
            }

        }

        else {
            return res.send(`<script>alert('something went wrong');window.location.href='/admin/batch/register';</script>`)
        }
    })
})

router.post("/update-request", (req, res) => {

    const batch_id = req.body.batch_id;
    const batch_name = req.body.batch_name;
    const course_name = req.body.course_name;
    const batch_start_date = req.body.batch_start_date;
    const batch_end_date = req.body.batch_end_date;

    const course_id_search_query = "select course_id from course where course_name=?";
    connection.query(course_id_search_query, [course_name], (err, result) => {
        if (err) {
            console.log("course_id_search_query error:" + err)
            return res.status(502).send("Internal Server Error");
        }

        else if (result) {


            if (result.length > 0) {

                console.log(result[0].course_id)





                connection.query(`update batch  set batch_name='${batch_name}',course_id=${result[0].course_id},batch_start_date='${batch_start_date}',batch_end_date='${batch_end_date}'   where batch_id=${batch_id}`, (err, result) => {
                    if (err) {
                        console.log("batch update query error:" + err)
                        return res.status(502).send("Internal Server Error");
                    }
                    if (result) {


                        if (result.affectedRows === 1) {
                            console.log(result)
                            return res.send(`<script>alert('batch updated successgully');
                            window.location.href='/admin-user/batch/view';</script>`)
                        }

                        else {
                            return res.status(404).send(`<script>alert('batch not found');
                            window.location.href='/admin-user/batch/register';</script>`)
                        }
                    }

                });
            }

            else {
                return res.status(404).send(`<script>alert('course not found');window.location.href='/admin-user/batch/register';</script>`)
            }

        }

        else {
            return res.send(`<script>alert('something went wrong');window.location.href='/admin-user/batch/register';</script>`)
        }
    })



})

router.post("/delete-request", (req, res) => {
    const batch_id = req.body.batch_id;
    connection.query(`delete from batch where batch_id=${batch_id}`, (err, result) => {
        if (err) {

            console.log("delete error:" + err)
            if (err.code ==="ER_ROW_IS_REFERENCED_2") {
                return res.send(`<script>alert('first delete batch student');window.location.href='/admin-user/student/view';</script>`)

            }




        }


        else if (result.affectedRows === 1) {
            return res.send(`<script>alert('successfully  deleted batch ');window.location.href='/admin-user/batch/view';</script>`)

        }
        else if (result.affectedRows === 0) {
            return res.send(`<script>alert('batch record not found');window.location.href='/admin-user/batch/view';</script>`)

        }


        else
        {

            return res.send(`<script>alert('something went wrong');window.location.href='/admin-user/batch/view';</script>`)

        }
    })
})

//database page end



module.exports = router;