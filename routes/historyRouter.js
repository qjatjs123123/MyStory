const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const getConnection = require('../db');
const multer = require('multer');
const upload = multer({ dest: 'public/upload' })

router.post("/gethistory", async (req, res) => {
  try {
    const {userID} = req.body; 
    const follow = await getfollow(jwt.verify(req.cookies.jwt, "1234").userID);
      getConnection((conn) => {
        let param = [jwt.verify(req.cookies.jwt, "1234").userID]
          let sql = `SELECT 
          follow.touserID AS userID,
          bbs.bbsTitle AS bbsTitle,
          bbs.bbsContent AS bbsContent,
          bbs.bbsImage AS bbsImage,
          history.historyDate AS historyDate,
          member.userNickname AS userNickname,
          member.userState AS userState,
          member.userProfile AS userProfile
         FROM follow, history, bbs, member WHERE follow.fromuserID = ? AND follow.touserID = history.userID AND bbs.bbsID = history.bbsID 
         AND bbs.bbsAvailable = 1 AND member.userID = bbs.userID`;
          conn.query(sql, param,
              (err, rows, fields) => {
                  if (err) { throw err }    
                  else {res.send({follow: follow, rows:rows});}
                  conn.release();
              })
      })

  } catch (error) {
      res.send(false);
  }
})
async function getfollow(userID) {
  return new Promise((resolve, reject) => {
      getConnection((conn) => {
          let param = [userID]
          let sql = `SELECT  
            member.userID AS userID,
            member.userNickname AS userNickname,
            member.userState AS userState,
            member.userProfile AS userProfile 
          FROM follow , member
          WHERE follow.fromuserID = ? AND follow.touserID = member.userID`;
          conn.query(sql, param, (err, rows, fields) => {
              if (err) {
                  console.log(err);
                  reject(err);
                  return;
              }
              conn.release();
              const result = rows;
              resolve(result);
          });
      });
  });
}
module.exports = router;