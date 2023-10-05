const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const getConnection = require('../db');
const multer = require('multer');
const upload = multer({ dest: 'public/upload' })

router.post("/getProfile", async (req, res) => {
  try {
    const {curpage,input} = req.body;  
    const count = await getCount(curpage,input);
      getConnection((conn) => {
        let param = []
          let sql = "SELECT  userID, userNickname, userState, userProfile FROM member ";
          if (input != ''){
             sql += "WHERE userID LIKE ?"
            param.push(`${input}%`)
          }
          sql += " ORDER BY userKey DESC LIMIT ?, ?";
          param.push(curpage*12);
          param.push(12)
          conn.query(sql, param,
              (err, rows, fields) => {
                  if (err) { throw err }    
                  else {let data = {count:count,rows:rows}; res.send(data);}
                  conn.release();
              })
      })

  } catch (error) {
      res.send(false);
  }
})
async function getCount(curpage,input) {
  return new Promise((resolve, reject) => {
      getConnection((conn) => {
          let param = []
          let sql = "SELECT  COUNT(*) AS COUNT FROM member ";
          if (input != ''){
            sql += "WHERE userID LIKE ?"
           param.push(`${input}%`)
         }
          conn.query(sql, param, (err, rows, fields) => {
              if (err) {
                  console.log(err);
                  reject(err);
                  return;
              }
              conn.release();
              const result = rows[0].COUNT;
              resolve(result);
          });
      });
  });

}
module.exports = router;