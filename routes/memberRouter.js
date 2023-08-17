const express = require("express");
const router = express.Router();
const getConnection = require('../db');

router.post("/login", (req, res) => {
    const {userId, userPw} = req.body;
    let params = [userId, userPw];
    getConnection((conn) => {
        const sql = "SELECT * FROM member WHERE userID = ? AND userPassword = ?";
        let params = [userId, userPw];
        conn.query(sql,params,
            (err,rows,fields) => {
                conn.release();
                console.log(rows);
                res.send(rows);
            })
    })
})

router.post("/idcheck", (req, res) => {
    const {userId} = req.body;
    let params = [userId];
    getConnection((conn) => {
        const sql = "SELECT * FROM member WHERE userID = ?";
        let params = [userId];
        conn.query(sql,params,
            (err,rows,fields) => {
                conn.release();
                console.log(rows);
                res.send(rows);
            })
    })
})

module.exports = router;