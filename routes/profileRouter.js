const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const getConnection = require('../db');
const multer = require('multer');
const upload = multer({ dest: 'public/upload' })

router.post("/getProfile", async (req, res) => {
  try {
    const {curpage} = req.body;  
      getConnection((conn) => {
          const sql = "SELECT userID, userNickname, userState, userProfile FROM member ORDER BY userKey DESC LIMIT ?, ?";
          conn.query(sql, [curpage*12, 12],
              (err, rows, fields) => {
                  if (err) { throw err }
                  else res.send(rows);
                  conn.release();
              })
      })

  } catch (error) {
      res.send(false);
  }
})

module.exports = router;