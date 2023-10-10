const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const getConnection = require('../db');
const multer = require('multer');
const upload = multer({ dest: 'public/upload' })

router.post("/gethistory", async (req, res) => {
  try {
    const {historypage,input} = req.body; 
    const historyCount = await gethistoryCount(jwt.verify(req.cookies.jwt, "1234").userID, input)
      getConnection((conn) => {
        let param = [jwt.verify(req.cookies.jwt, "1234").userID]
          let sql = `SELECT 
          follow.touserID AS userID,
          bbs.bbsID AS bbsID,
          bbs.bbsTitle AS bbsTitle,
          bbs.bbsContent AS bbsContent,
          bbs.bbsImage AS bbsImage,
          history.historyDate AS historyDate,
          member.userNickname AS userNickname,
          member.userState AS userState,
          member.userProfile AS userProfile
         FROM follow, history, bbs, member WHERE follow.fromuserID = ? AND follow.touserID = history.userID AND bbs.bbsID = history.bbsID 
         AND bbs.bbsAvailable = 1 AND member.userID = bbs.userID`
         if (input != ''){
          sql += " AND bbs.userID LIKE ?"
          param.push(`${input}%`);
         }
         sql += ` ORDER BY history.historyID DESC`;
         sql += ` LIMIT ?, ?`;
         param.push(15 * (historypage-1));
        param.push(15);
          conn.query(sql, param,
              (err, rows, fields) => {
                  if (err) { res.send(false); console.log(err) }    
                  else {res.send({historyCount:historyCount, rows:rows});}
                  conn.release();
              })
      })


  } catch (error) {
      res.send(false);
  }
})
async function gethistoryCount(userID,input) {
  return new Promise((resolve, reject) => {
      getConnection((conn) => {
        let param = [userID]
        let sql = `SELECT 
        COUNT(*) AS COUNT
       FROM follow, history, bbs, member WHERE follow.fromuserID = ? AND follow.touserID = history.userID AND bbs.bbsID = history.bbsID 
       AND bbs.bbsAvailable = 1 AND member.userID = bbs.userID`;
       if (input != ''){
        sql += " AND bbs.userID LIKE ?"
        param.push(`${input}%`);
       }
        conn.query(sql, param,
            (err, rows, fields) => {
                if (err) { res.send(false); console.log(err) }    
                conn.release();
                const result = rows[0].COUNT;
                resolve(result);
            })
      });
  });
}
router.post("/getfollowlist", async (req, res) => {
  try {
    const {followpage, input} = req.body; 
    const follow = await getfollow(jwt.verify(req.cookies.jwt, "1234").userID, followpage, input);
    const followcount = await getfollowListCount(jwt.verify(req.cookies.jwt, "1234").userID, input);
    res.send({follow:follow, followcount:followcount})
  } catch (error) {
      res.send(false);
  }
})
async function getfollow(userID, followpage,input) {
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
          if (input != ''){
            sql += " AND member.userID LIKE ?"
            param.push(`${input}%`);
           }
          sql += ` LIMIT ?, ?`;
        
        param.push(15 * (followpage-1));
        param.push(15);
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
async function getfollowListCount(userID,input) {
  return new Promise((resolve, reject) => {
      getConnection((conn) => {
          let param = [userID]
          let sql = `SELECT  
            COUNT(*) AS COUNT
          FROM follow , member
          WHERE follow.fromuserID = ? AND follow.touserID = member.userID`;
          if (input != ''){
            sql += " AND member.userID LIKE ?"
            param.push(`${input}%`);
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