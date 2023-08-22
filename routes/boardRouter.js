const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const getConnection = require('../db');
const multer = require('multer');
const upload = multer({dest : 'public/upload'})

router.use('/image', express.static('public/upload'));
router.post('/bbsContentImage', upload.single('img'), (req, res)=> {
    // 해당 라우터가 정상적으로 작동하면 public/uploads에 이미지가 업로드된다.
    // 업로드된 이미지의 URL 경로를 프론트엔드로 반환한다.
    console.log('전달받은 파일', req.file);
    console.log('저장된 파일의 이름', req.file.filename);

    // 파일이 저장된 경로를 클라이언트에게 반환해준다.
    const IMG_URL = '/upload/' + req.file.filename;;
    console.log(IMG_URL);
    res.json({ url: IMG_URL });
    });

router.post("/bbsListCount", (req, res) => {   
    getConnection((conn) => {
        const {title, userID, startDate, endDate} = req.body;  
        let param = [];
        let sql = "SELECT COUNT(*) AS COUNT FROM bbs WHERE bbsAvailable = 1 ";
        if (title !== '') {sql += 'AND bbsTitle = ?'; param.push(title)}
        if (userID !== '') {sql += 'AND userID = ?'; param.push(userID)}
        if (startDate !== null) {sql += 'AND bbsDate >= ?'; param.push(startDate)}
        if (endDate !== null) {sql += 'AND bbsDate <= ?'; param.push(endDate)}


        conn.query(sql, param,
            (err, rows, fields) => {
                console.log(err);
                if (err) {res.send(false);console.log(err);}
                else res.send(rows);
                conn.release();
            })
    })

})

async function getMaxbbsID(){
    return new Promise((resolve, reject) => {
        getConnection((conn) => {
            const sql = "SELECT MAX(bbsID)+1 AS max FROM bbs";
            conn.query(sql, [], (err, rows, fields) => {
                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }
                conn.release();
                const result = rows[0].max;
                console.log(result);
                resolve(result);
            });
        });
    });
    
}

router.post("/bbsListInsert", async (req, res) => {
    try{
        const {bbsTitle, bbsContent} = req.body;    
        const bbsID = await getMaxbbsID();

        getConnection((conn) => {
        const sql = "INSERT INTO bbs(bbsID, bbsTitle, userID, bbsDate, bbsContent, bbsAvailable) VALUES (?, ?, ?, NOW(), ?, ?)";
        conn.query(sql, [bbsID, bbsTitle, jwt.verify(req.cookies.jwt, "1234").userID, bbsContent,1],
            (err, rows, fields) => {
                if (err) {throw err}
                else res.send(true);
                conn.release();
            })
        })
        
    }catch(error){
        return false
    }
    

})
router.post("/bbsUpdate", async (req, res) => {
    try{
        const {bbsID, bbsTitle, bbsContent} = req.body;    

        getConnection((conn) => {
        const sql = "UPDATE bbs SET bbsTitle = ?, bbsContent = ? WHERE bbsID = ?";
        conn.query(sql, [bbsTitle, bbsContent, bbsID],
            (err, rows, fields) => {
                if (err) {throw err}
                else res.send(rows);
                conn.release();
            })
        })
        
    }catch(error){
        res.send(false);
    }
    

})

router.post("/bbsConditionList", (req, res) => {
    const {title, userID, startDate, endDate,limit, page, orderTarget,orderValue} = req.body;  
    let param = [];
    let sql = "SELECT bbsID, bbsTitle, userID, bbsDate, bbsContent FROM bbs WHERE bbsAvailable = 1 ";
    if (title !== '') {sql += 'AND bbsTitle = ?'; param.push(title)}
    if (userID !== '') {sql += 'AND userID = ?'; param.push(userID)}
    if (startDate !== null) {sql += 'AND bbsDate >= ?'; param.push(startDate)}
    if (endDate !== null) {sql += 'AND bbsDate <= ?'; param.push(endDate)}
    sql += `ORDER BY ${orderTarget} ${orderValue} LIMIT ?, ?`;
    param.push(limit*(page-1));
    param.push(limit);
    getConnection((conn) => {
        conn.query(sql, param,
            (err, rows, fields) => {
                if (err) {res.send(false);console.log(err);}
                else res.send(rows);
                conn.release();
            })
    })

})

router.post("/selectBbsIDInfo", (req, res) => {
    const {bbsID} = req.body;  
    getConnection((conn) => {
        const sql = "SELECT * FROM bbs WHERE bbsAvailable = 1 AND bbsID = ?";
        conn.query(sql, [bbsID],
            (err, rows, fields) => {
                if (err) {res.send(false);console.log(err);}
                else res.send(rows);
                conn.release();
            })
    })

})


router.post("/loginCheck", (req, res) => {
    try {
        const verified = jwt.verify(req.cookies.jwt, "1234");
        res.send(jwt.verify(req.cookies.jwt, "1234").userID);
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