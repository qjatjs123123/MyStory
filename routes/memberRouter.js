const express = require("express");
const router = express.Router();
const getConnection = require('../db');
const {google} = require('googleapis');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const bcrypt = require('bcrypt');


const CLIENT_ID = '241966183545-i1kij6ck37n9l4so3sra5388tvogb3jf.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = '1//046ucT9uHX1sCCgYIARAAGAQSNwF-L9Ircxy-UzMkJoqKskGQNB97q2i06PCiGCcoUovcthjth9fhhCcs7-zZ-AqS2UvndVufT_c';
const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET);
oAuth2Client.setCredentials({refresh_token: REFRESH_TOKEN});


function encrypt(target){
    return bcrypt.hashSync(target, 10);
}

async function sendMail(userName, email){
    try{
        const accessToken = await oAuth2Client.getAccessToken();

        const transport = nodemailer.createTransport({
            service :'gmail',
            auth:{
                type: 'OAuth2',
                user: 'qjatjs123123@gmail.com',
                clientId : CLIENT_ID,
                clientSecret : CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken
            }
        })
        const randomBytes = crypto.randomBytes(20).toString('hex');
        const mailOptions = {
            from: '관리자 <qjatjs123123@gmail.com>',
            to: email,
            subject: "비밀번호 인증입니다.",
            text: '비밀번호 인증입니다.',
            html: `<h1>비밀번호 인증입니다.<h1><br/><h3><a href=http://localhost:3000/changePw?token=${randomBytes}&userID=${userName}>비밀번호 변경하기</a><h3>`
        };
        await insertEmailCode(randomBytes,userName, email);
        const result = await transport.sendMail(mailOptions);
        return result;
    }catch(error){
        console.log(error);
        throw error;
    }
}

async function insertEmailCode(token,userID, userEmail){
    getConnection((conn) => {
        const sql = "UPDATE member SET userEmailCode = ?, userEmailTime = DATE_ADD(NOW(), INTERVAL 1 MINUTE) WHERE userID = ? AND userMail = ?";
        let params = [token,userID,userEmail];
        conn.query(sql,params,
            (err,rows,fields) => {
                if(err) throw err;
                conn.release();
            })
    })
}

router.post("/checkToken", (req, res) => {
    const {userEmailCode, userID} = req.body;  
    getConnection((conn) => {
        const sql = "SELECT * FROM member WHERE userID = ? AND userEmailCode = ? AND userEmailTime > NOW()-60000";
        let params = [userID,userEmailCode];
        conn.query(sql,params,
            (err,rows,fields) => {
                conn.release();
                if (rows.length === 0) res.send(false);
                else res.send(true);
            })
    })
})

router.post("/changePw", (req, res) => {
    const {userPw, userID} = req.body;
    let params = [userPw, userID];
    getConnection((conn) => {
        const sql = "UPDATE member SET userPassword = ? WHERE userID = ?";
        let params = [userPw, userID];
        conn.query(sql,params,
            (err,rows,fields) => {
                conn.release();
                res.send(rows);
            })
    })
})

router.post("/sendEmail", (req, res) => {
    const {userName, userNum, userEmail} = req.body;  
    getConnection((conn) => {
        const sql = "SELECT * FROM member WHERE userID = ? AND userNum = ? AND userMail = ?";
        let params = [userName, userNum, userEmail];
        conn.query(sql,params,
            (err,rows,fields) => {
                conn.release();
                if (rows.length === 0) res.send('존재하지 않는 정보입니다.');
                else{
                    sendMail(userName, userEmail)
                        .then((result) => res.send('이메일을 발송하였습니다.'))
                        .catch((error) => res.send('이메일 발송 중 에러가 발생하였습니다.'));
                    
                }
            })
    })
})

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
                res.send(rows);
            })
    })
})

router.post("/join", (req, res) => {
    const {userId, userPw, userName, userMail, userNum} = req.body;  
    getConnection((conn) => {
        const sql = 'INSERT INTO member VALUES (?, ?, ?, ?, ?, ?,?)';
        let params = [userId, encrypt(userPw), userName, userMail, encrypt(userNum),null,null];
        conn.query(sql,params,
            (err,rows,fields) => {
                conn.release();
                res.send(rows);
                console.log(err);
            })
    })
})

router.post("/findId", (req, res) => {
    const {userName, userNum} = req.body;  
    getConnection((conn) => {
        const sql = "SELECT * FROM member WHERE userName = ?";
        let params = [userName];
        conn.query(sql,params,
            (err,rows,fields) => {
                conn.release();
                let flg = false;
                rows.forEach((row) => {      
                    if(bcrypt.compareSync(userNum,row.userNum)){res.send(row); flg=true;}
                })
                if (!flg) res.send([]);
                
            })
    })
})

module.exports = router;