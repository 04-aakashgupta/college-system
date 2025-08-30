

const express = require('express');
const router = express.Router();
const connection = require('../../../../utils/mysql_connection');



router.get('/assign-student-batch', (req, res) => {

    let sendData = { "student_id": null }
    console.log("hi")

    return res.render("admin_user/batch/manage-student-batch/assign-batch.ejs", { "sendData": sendData });




})




router.get('/update-student-batch', (req, res) => {

    return res.render("admin_user/batch/manage-student-batch/update-batch.ejs");
})
router.get('/view-student-batch', (req, res) => {
    const query = `select student_id,student_name,student.batch_id,student.course_id,batch_name,course_name
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

        res.render('admin_user/batch/manage-student-batch/view-assigned-batch.ejs', { student_data: result });






    })




})


router.get('/delete-student-batch', (req, res) => {
    return res.sendFile(__dirname + '/delete-assigned-batch.html');
})

router.post('/assign-student-batch-request', (req, res) => {

    const student_id = req.body.student_id;
    const batch_id = req.body.batch_id;

    console.log("student_id", student_id);
    console.log("batch_id", batch_id);
    if (student_id && batch_id) {
        console.log("student_id and batch_id are present");

        const update_student_Batch_Query = "UPDATE student SET batch_id = ? WHERE student_id = ?";
        connection.query(update_student_Batch_Query, [batch_id, student_id], (err, result) => {

            if (err) {
                console.log(" update_student_Batch_Query error:", err)



                return res.status(502).send(`<script>alert(' 502 Internal  server error');window.location.href='admin-user/batch/manage-student-batch/assign-student-batch';</script>`)


            }

            else if (result.affectedRows === 0) {
                console.log("No rows updated");
                return res.status(404).send(`<script>alert('Student not found');window.location.href='admin-user/batch/manage-student-batch/assign-student-batch';</script>`);
            }
            else if (result.affectedRows === 1) {
                console.log("Student batch updated successfully");
                return res.send(`<script>alert('Student Batch Updated Successfully');window.location.href='admin-user/batch/manage-student-batch/view-student-batch';</script>`);
            }

            else {
                console.log("Unexpected result  :", result);
                return res.status(500).send(`<script>alert('Something went wrong');window.location.href='admin-user/batch/manage-student-batch/assign-student-batch';</script>`);

            }
        })



    }
    else if (student_id) {
        console.log("student_id is present but batch_id is not present");
        const query = `SELECT course_name,course.course_id,student_name,student.student_id,batch_name,batch.batch_id FROM  student join course on course.course_id=student.course_id join batch on  course.course_id=batch.course_id   where student.student_id=?`;
        connection.query(query, [student_id], (err, result) => {
            if (err) {
                console.error("Error executing query:", err);
                return res.status(500).send("Internal Server Error");
            }
            else if (result.length > 0) {
                console.log("result", result);
                let sendData = { "result": result };
                return res.render("admin_user/batch/manage-student-batch/assign-batch.ejs", { "sendData": sendData });
            }

            else if (result.length === 0) {
                console.log("No student found with the provided ID  or course not assigned to any batch");
                return res.status(404).send(`<script>alert('No student found with the provided ID or course not assigned to any batch');window.location.href='admin-user/batch/manage-student-batch/assign-student-batch';</script>`);
            }
            else {
                console.log("Unexpected result:", result);
                return res.status(500).send(`<script>alert('Something went wrong');window.location.href='admin-user/batch/manage-student-batch/assign-student-batch';</script>`);

            }
        });

    }

    else if (!student_id) {
        return res.status(400).send(`<script>alert("Please provide student ID ");window.location.href='admin-user/batch/manage-student-batch/assign-student-batch';</script>`);
    }

    else {
        console.log("Unexpected result:", result);
        return res.status(500).send(`<script>alert('Something went wrong');window.location.href='admin-user/batch/manage-student-batch/assign-student-batch';</script>`);

    }
})



router.post('/update-student-batch-request', (req, res) => {
    const student_id = req.body.student_id;
    const batch_id = req.body.batch_id;
    console.log("student_id", student_id);
    console.log("batch_id", batch_id);

    if (student_id && batch_id) {

        const update_student_Batch_Query = "UPDATE student SET batch_id = ? WHERE student_id = ?";
        connection.query(update_student_Batch_Query, [batch_id, student_id], (err, result) => {

            if (err) {
                console.log(" update_student_Batch_Query error:", err)
                return res.status(502).send(`<script>alert(' 502 Internal  server error');window.location.href='admin-user/batch/manage-student-batch/update-student-batch';</script>`)

            }

            else if (result.affectedRows === 0) {
                console.log("No rows updated");
                return res.status(404).send(`<script>alert('Student not found');window.location.href='admin-user/batch/manage-student-batch/view-student-batch';</script>`);
            }
            else if (result.affectedRows === 1) {
                console.log("Student batch updated successfully");
                return res.send(`<script>alert('Student Batch Updated Successfully');window.location.href='admin-user/batch/manage-student-batch/view-student-batch';</script>`);
            }

            else {
                console.log("Unexpected result:", result);
                return res.status(500).send(`<script>alert('Something went wrong');window.location.href='admin-user/batch/manage-student-batch/update-student-batch';</script>`);

            }
        })
    }
    else if (student_id) {
        const query = `SELECT   student.batch_id as assigned_batch_id , batch2.batch_name as assigned_batch_name,course.course_name,course.course_id,student_name,student.student_id,batch1.batch_name,batch1.batch_id FROM  student join course on course.course_id=student.course_id join batch as batch1 on  course.course_id=batch1.course_id   join batch as batch2 on student.batch_id=batch2.batch_id  where student.student_id=?`;
        connection.query(query, [student_id], (err, result) => {
            if (err) {
                console.error("Error executing query:", err);
                return res.status(500).send("Internal Server Error");
            }
            else if (result.length > 0) {
                console.log("result", result);
                let sendData = { "result": result };

                if (result[0].assigned_batch_id === null) {


                    console.log("No batch assigned to this student, student_id:", student_id);
                    return res.status(404).send(`<script>alert('No batch assigned to this student first assign batch');window.location.href='admin-user/batch/manage-student-batch/assign-student-batch';</script>`);

                }

                else if (result[0].assigned_batch_id !== null) {
                    console.log("Batch assigned to this student, student_id:", student_id);
                    return res.render("admin_user/batch/manage-student-batch/update-batch.ejs", { "sendData": sendData });

                }


                else {
                    console.log("Unexpected result:", result);
                    return res.status(500).send(`<script>alert('Something went wrong');window.location.href='admin-user/batch/manage-student-batch/update-student-batch';</script>`);
                }
            }



            else if (result.length === 0) {
                console.log("No student found with the provided ID");
                return res.status(404).send(`<script>alert('No student found with the provided ID');window.location.href='admin-user/batch/manage-student-batch/view-student-batch';</script>`);
            }



            else {
                console.log("Unexpected result:", result);
                return res.status(500).send(`<script>alert('Something went wrong');window.location.href='admin-user/batch/manage-student-batch/update-student-batch';</script>`);

            }
        });

    }


    else if (!student_id) {
        return res.status(400).send(`<script>alert("Please provide student ID ");window.location.href='admin-user/batch/manage-student-batch/update-student-batch';</script>`);
    }

    else {
        console.log("Unexpected result:", result);
        return res.status(500).send(`<script>alert('Something went wrong');window.location.href='admin-user/batch/manage-student-batch/update-student-batch';</script>`);

    }

});

router.post('/delete-assigned-batch-request', (req, res) => {
    const student_id = req.body.student_id;
    if (!student_id) {
        return res.status(400).send(`<script>alert("Please provide student ID ");window.location.href='/admin-user/batch/manage-student-batch/delete-student-batch';</script>`);
    }


    else if (student_id) {


        const update_student_Batch_Query = "UPDATE student SET batch_id = NULL WHERE student_id = ?";
        connection.query(update_student_Batch_Query, [student_id], (err, result) => {
            if (err) {
                console.log(" update_student_Batch_Query error:", err)
                return res.status(502).send(`<script>alert(' 502 Internal  server error');window.location.href='/admin-user/batch/manage-student-batch/delete-student-batch';</script>`)

            }

            else if (result.affectedRows === 0) {
                console.log("No rows updated");
                return res.status(404).send(`<script>alert('Student not found');window.location.href='/admin-user/batch/manage-student-batch/view-student-batch';</script>`);
            }
            else if (result.affectedRows === 1) {
                console.log("Student batch deleted successfully");
                return res.send(`<script>alert('Student Batch Deleted Successfully');window.location.href='/admin-user/batch/manage-student-batch/view-student-batch';</script>`);
            }

            else {
                console.log("Unexpected result:", result);
                return res.status(500).send(`<script>alert('Something went wrong');window.location.href='/admin-user/batch/manage-student-batch/delete-student-batch';</script>`);

            }
        })

    }
    else {
        console.log("Unexpected result:", result);
        return res.status(500).send(`<script>alert('Something went wrong');window.location.href='/admin-user/batch/manage-student-batch/delete-student-batch';</script>`);

    }
});


module.exports = router;