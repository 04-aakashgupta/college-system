const express = require('express');
const router = express.Router();
const connection = require("../../../utils/mysql_connection")



router.get("/take", (req, res) => {


    let sendData = {}


    const get_batch_name = `select batch.batch_id,batch.batch_name,batch_end_date from student join batch on student.batch_id=batch.batch_id 
    where batch_end_date>=(SELECT CURDATE())   and    student.batch_id not in( select batch.batch_id from batch join student on
     student.batch_id= batch.batch_id join attendence on student.student_id=attendence.student_id  where attendence_date=((SELECT CURDATE()))) group by student.batch_id`;
    connection.query(get_batch_name, (err, result) => {
        if (err) {
            console.log("get_batch_name error:", err)
            return res.status(502).send("502 internal server error ")
        }

        else if (result.length > 0) {
            console.log(result)
            sendData = { result: result }
            return res.render("admin_user/attendence/take-attendence-select-batch.ejs", { sendData })
        }

        else if (result.length === 0) {
            return res.status(404).send(`<script>alert("404 batch not available for attendence");window.location.href="/admin-user";</script>`)


        }

        else {
            return res.send(`<script>alert("Something Went wrong");window.location.href="/admin-user";</script>`)

        }
    })

})


router.get("/take-attendence-batch/:batch_id", (req, res) => {
    let sendData = {};
    const batch_id = req.params.batch_id;
    if (batch_id) {

        const prepare_take_attendence_data = `select student_id,student_name,batch_name from student join batch on batch.batch_id=student.batch_id  where student.batch_id=?`
        connection.query(prepare_take_attendence_data, [batch_id], (err, result) => {
            if (err) {
                console.log("prepare_take_attendence_data err:", err);
                return res.status(502).send(`<script>alert("502 internal server error");window.location.href="/admin-user";</script>`)

            }

            else if (result.length > 0) {
                console.log(result)
                sendData = { result: result };
                return res.render("admin_user/attendence/take-attendence-batch.ejs", { sendData })

            }

            else {

                return res.send(`<script>alert("Something Went Wrong ");window.location.href="/admin-user";</script>`)

            }
        })

    }


})


router.post("/take-batch-attendence-request", (req, res) => {
    let sendData = {};

    let student_ids = req.body.student_ids

    if (typeof student_ids === "string") {

        student_ids = [student_ids];
    }
    const student_absent_ids = req.body.student_absent_ids ? req.body.student_absent_ids : [];
    const batch_id = req.body.batch_id;

    const prepare_attendence_value = student_ids.map((student_id) => {
        if (student_absent_ids.includes(student_id)) {
            return [student_id, "absent"];
        }
        return [student_id, "present"];
    });


    if (prepare_attendence_value.length > 0) {






        const insert_attendence = `insert into  attendence(student_id,attendence_status) values ?`;
        console.log("prepare attendence_value:", prepare_attendence_value)
        connection.query(insert_attendence, [prepare_attendence_value], (err, result) => {
            if (err) {
                console.log("insert_attendence err:", err);
                return res.status(502).send(`<script>alert("502 internal server error");window.location.href="/admin-user/attendence/take";</script>`)
            }

            else if (result.affectedRows > 0) {
                console.log("attendence taken successfully")
                return res.send(`<script>alert("attendence taken successfully");window.location.href="/admin-user/attendence/view";</script>`)
            }

            else {
                return res.send(`<script>alert("Something Went Wrong");window.location.href="/admin-user/attendence/take";</script>`)

            }
        }
        )
    }
    else {
        return res.status(404).send(`<script>alert("something went wrong");window.location.href="/admin-user/attendence/take";</script>`)
    }

})



router.post("/take-select-batch-request", (req, res) => {


    let sendData = {};

    const batch_id = req.body.batch_id;
    if (!batch_id) {
        return res.status(404).send(`<script>alert("please provide batch name");window.location.href="/admin-user";</script>`)

    }

    else if (batch_id) {


        return res.redirect("/admin-user/attendence/take-attendence-batch/" + batch_id)

    }

})




router.get("/view", (req, res) => {

    let sendData = {}
    const view_attendence_query = `select batch.batch_name,batch.batch_id  from  batch `;



    connection.query(view_attendence_query, (err, result) => {
        if (err) {

            console.log("view_attendence_query err:", err);
            return res.status(502).send("502 internal server error")
        }
        else if (result.length > 0) {
            console.log(result)
            sendData = { result: result }
            return res.render("admin_user/attendence/view-attendence-select-batch.ejs", { sendData })
        }
        else if (result.length === 0) {
            return res.status(404).send(`<script>alert("404 batch  attendence record not  available  ");window.location.href="/admin-user";</script>`)


        } else {
            return res.send(`<script>alert("Something Went wrong");window.location.href="/admin-user";</script>`)
        }
    })
}
)


router.post("/view-attendence-select-batch-request", (req, res) => {



    let sendData = {};

    const batch_id = req.body.batch_id;
    const attendence_date = req.body.attendence_date;
    console.log("attendence_date:", attendence_date)
    if (!batch_id && !attendence_date) {
        return res.status(404).send(`<script>alert("please provide batch name and attendence date");window.location.href="/admin-user";</script>`)

    }
    else if (!batch_id) {
        return res.status(404).send(`<script>alert("please provide batch name");window.location.href="/admin-user";</script>`)

    }
    else if (!attendence_date) {
        return res.status(404).send(`<script>alert("please provide attendence date");window.location.href="/admin-user";</script>`)

    }


    else if (batch_id && attendence_date) {
        return res.redirect("/admin-user/attendence/view-attendence-batch/" + batch_id + "?attendence_date=" + attendence_date)

    }

    else {
        return res.send(`<script>alert("Something Went wrong");window.location.href="/admin-user";</script>`)
    }

}
)



router.get("/view-attendence-batch/:batch_id", (req, res) => {
    let sendData = {};
    const batch_id = req.params.batch_id;
    const attendence_date = req.query.attendence_date;
    console.log("attendence_date:", attendence_date)
    if (batch_id && attendence_date) {

        const prepare_view_attendence_data = `select student.student_id,student.student_name,attendence.attendence_status,attendence.attendence_date,batch.batch_name from student
            join batch on batch.batch_id=student.batch_id 
            join attendence on attendence.student_id=student.student_id 
            where student.batch_id=? and attendence.attendence_date=?`
        connection.query(prepare_view_attendence_data, [batch_id, attendence_date], (err, result) => {
            if (err) {
                console.log("prepare_view_attendence_data err:", err);
                return res.status(502).send(`<script>alert("502 internal server error");window.location.href="/admin-user";</script>`)
            }

            else if (result.length > 0) {
                console.log(result)
                sendData = { result: result };

                
                return res.render("admin_user/attendence/view-batch-attendence.ejs", { sendData })

            }

            else {

                return res.send(`<script>alert("No attendence record found for selected date");window.location.href="/admin-user/attendence/view-attendence-select-batch";</script>`)

            }


        })

    }




    else if (!batch_id) {
        return res.status(404).send(`<script>alert("please provide batch name");window.location.href="/admin-user";</script>`)
    }
    else if (!attendence_date) {
        return res.status(404).send(`<script>alert("please provide attendence date");window.location.href="/admin-user";</script>`)

    }



    else {
        return res.send(`<script>alert("Something Went Wrong ");window.location.href="/admin-user";</script>`)

    }


})









module.exports = router;

