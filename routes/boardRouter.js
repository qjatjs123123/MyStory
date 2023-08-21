const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const getConnection = require('../db');

router.post("/bbsListCount", (req, res) => {
    
    getConnection((conn) => {
        const sql = "SELECT COUNT(*) AS COUNT FROM bbs WHERE bbsAvailable = 1";
        conn.query(sql, [],
            (err, rows, fields) => {
                if (err) res.send(false);
                else res.send(rows);
                conn.release();
            })
    })

})

router.post("/bbsList", (req, res) => {
    const {limit, page} = req.body;  
    getConnection((conn) => {
        const sql = "SELECT bbsID, bbsTitle, userID, bbsDate, bbsContent FROM bbs WHERE bbsAvailable = 1 ORDER BY bbsID DESC LIMIT ?, ?";
        conn.query(sql, [limit*(page-1), limit],
            (err, rows, fields) => {
                if (err) res.send(false);
                else res.send(rows);
                conn.release();
            })
    })

})

router.post("/loginCheck", (req, res) => {
    try {
        const verified = jwt.verify(req.cookies.jwt, "1234");
        res.send(true);
    } catch (err) {
        res.send(false);
    }
})

router.post("/getTimer", (req, res) => {
    try {
        const userID = jwt.verify(req.cookies.jwt, "1234").userID;
        getConnection((conn) => {
            const sql = "SELECT TIMESTAMPDIFF(SECOND, userLoginTime , NOW()) AS TIMER FROM member WHERE userID = ?";
            let params = [userID];
            conn.query(sql, params,
                (err, rows, fields) => {
                    conn.release();
                    res.send(rows[0]);
                })
        })
    } catch (err) {
        res.send('logout')
    }
})

module.exports = router;