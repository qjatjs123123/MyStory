const express = require("express");
const router = express.Router();
const getConnection = require('../db');

router.post("/login", (req, res) => {
    const {userId, userPw} = req.body;
    let params = [userId, userPw];
    getConnection((conn) => {
        const sql = "SELECT * FROM member WHERE userID = ? AND userPassword = ?";
        let params = [userId, userPw];1
        conn.query(sql,params,
            (err,rows,fields) => {
                conn.release();
                console.log(rows);
                res.send(rows);
            })
    })
})

module.exports = router;