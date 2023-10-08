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
                  else {let data = {count:count,rows:rows};
                  console.log(data);
                  res.send(data);
                }
                  conn.release();
              })
      })

  } catch (error) {
      res.send(false);
  }
})
router.post("/getProfileImage", async (req, res) => {
  try {
      let param = [jwt.verify(req.cookies.jwt, "1234").userID]
      getConnection((conn) => {
        
          let sql = "SELECT userID, userProfile FROM member WHERE userID = ?";
          conn.query(sql, param,
              (err, rows, fields) => {
                  if (err) { throw err }    
                  else {res.send(rows);}
                  conn.release();
              })
      })

  } catch (error) {
      res.send(false);
  }
})
router.post("/userIDprofile", async (req, res) => {
  try {
    const {userID} = req.body; 
      getConnection((conn) => {
        let param = [userID]
          let sql = "SELECT userID, userProfile, userState, userNickname FROM member WHERE userID = ?";
          conn.query(sql, param,
              (err, rows, fields) => {
                  if (err) { throw err }    
                  else {res.send({userID:jwt.verify(req.cookies.jwt, "1234").userID, rows:rows});}
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

router.post("/getProfileinfo", async (req, res) => {
  try {
    const {userID} = req.body;  
    const bbscount = await getbbsCount(userID);
    const followcount = await getfollowCount(userID)
    const follow = await isfollow(userID,jwt.verify(req.cookies.jwt, "1234").userID);
    let data = {
      bbscount:bbscount,
      followcount:followcount,
      isfollow:follow};
    res.send(data);
  } catch (error) {
      res.send(false);
  }
})

router.post("/gethashTagGroup", async (req, res) => {
  try {
    const {userID} = req.body; 
      getConnection((conn) => {
        let param = [userID]
          let sql = "SELECT hashtag.hashTag, COUNT(*) AS COUNT FROM hashtag,hashtagpost WHERE hashtag.hashtagID = hashtagpost.hashTagID AND hashtagpost.userID = ? GROUP BY hashtag.hashTag";
          conn.query(sql, param,
              (err, rows, fields) => {
                  if (err) { throw err }    
                  else {res.send(rows);}
                  conn.release();
              })
      })

  } catch (error) {
      res.send(false);
  }
})

router.post("/getreplyCount", async (req, res) => {
  try {
    const {bbsID} = req.body; 
      getConnection((conn) => {
        let param = [bbsID]
          let sql = "SELECT COUNT(*) AS COUNT FROM reply WHERE bbsID = ? AND replyAvailable = 1";
          conn.query(sql, param,
              (err, rows, fields) => {
                  if (err) { throw err }    
                  else {res.send(rows);}
                  conn.release();
              })
      })

  } catch (error) {
      res.send(false);
  }
})

router.post("/follow", async (req, res) => {
  try {
    const {userID} = req.body; 
    const followcount = await insertfollow(userID,jwt.verify(req.cookies.jwt, "1234").userID)
    const follow = await insertfollowhistory(userID,jwt.verify(req.cookies.jwt, "1234").userID);
    res.send(true);
  } catch (error) {
      res.send(false);
  }
})

async function insertfollow(touserID, fromuserID) {
  return new Promise((resolve, reject) => {
      getConnection((conn) => {
          let param = [touserID, fromuserID]
          let sql = "INSERT INTO follow(touserID, fromuserID, followDate) VALUES (?, ?, NOW())"
          conn.query(sql, param, (err, rows, fields) => {
              if (err) {
                  reject(err);
                  return;
              }
              conn.release();
              resolve(true);
          });
      });
  });
}

async function insertfollowhistory(touserID, fromuserID) {
  return new Promise((resolve, reject) => {
      getConnection((conn) => {
          let param = [fromuserID,touserID]
          let sql = "INSERT INTO history(userID, touserID, historyDate) VALUES (?, ?, NOW())"
          conn.query(sql, param, (err, rows, fields) => {
              if (err) {
                  reject(err);
                  return;
              }
              conn.release();
              resolve(true);
          });
      });
  });
}

router.post("/unfollow", async (req, res) => {
  try {
    const {userID} = req.body; 
      getConnection((conn) => {
        let param = [userID,jwt.verify(req.cookies.jwt, "1234").userID]
          let sql = "DELETE FROM follow WHERE touserID = ? AND fromuserID = ?";
          conn.query(sql, param,
              (err, rows, fields) => {
                  if (err) { throw err }    
                  else {res.send(true);}
                  conn.release();
              })
      })

  } catch (error) {
      res.send(false);
  }
})

async function getbbsCount(userID) {
  return new Promise((resolve, reject) => {
      getConnection((conn) => {
          let param = [userID]
          let sql = "SELECT  COUNT(*) AS COUNT FROM bbs WHERE userID = ?";
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

async function getfollowCount(userID) {
  return new Promise((resolve, reject) => {
      getConnection((conn) => {
          let param = [userID]
          let sql = "SELECT  COUNT(*) AS COUNT FROM follow WHERE touserID = ?";
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
async function isfollow(userID,curuserID) {
  return new Promise((resolve, reject) => {
      if (userID === curuserID){
        resolve("me");
        return;
      }
      getConnection((conn) => {
          let param = [curuserID,userID]
          let sql = "SELECT  * FROM follow WHERE fromuserID = ? AND touserID = ?";
          conn.query(sql, param, (err, rows, fields) => {
              if (err) {
                  console.log(err);
                  reject(err);
                  return;
              }
              conn.release();
              let result = ''
              if (rows.length == 0) result = false;
              else result = true;
              resolve(result);
          });
      });
  });
}

module.exports = router;