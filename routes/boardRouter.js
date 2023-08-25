const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const getConnection = require('../db');
const multer = require('multer');
const upload = multer({ dest: 'public/upload' })

router.use('/image', express.static('public/upload'));
router.post('/bbsContentImage', upload.single('img'), (req, res) => {
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
        const { title, userID, startDate, endDate } = req.body;
        let param = [];
        let sql = "SELECT COUNT(*) AS COUNT FROM bbs WHERE bbsAvailable = 1 ";
        if (title !== '') { sql += 'AND bbsTitle LIKE ?'; param.push(`%${title}%`) }
        if (userID !== '') { sql += 'AND userID = ?'; param.push(userID) }
        if (startDate !== null) { sql += 'AND bbsDate >= ?'; param.push(startDate) }
        if (endDate !== null) { sql += 'AND bbsDate <= ?'; param.push(endDate) }


        conn.query(sql, param,
            (err, rows, fields) => {
                console.log(err);
                if (err) { res.send(false); console.log(err); }
                else res.send(rows);
                conn.release();
            })
    })

})

async function getMaxbbsID() {
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

function bbsPromise(conn, sql, param, isFinish,res) {
    return new Promise((resolve, reject) => {
        conn.query(sql, param,
            (err, rows, fields) => {
                if (err) {
                    console.log("reject");
                    reject(err);
                } else {
                    if (isFinish){
                        res.send(true);
                        conn.commit();
                    }
                    resolve(rows);
                }
            });
    });
}

router.post("/insertRecommend", async (req, res) => {
    const { bbsID, userID,flg } = req.body;
    getConnection(async (conn) => {
        conn.beginTransaction();
        let sql = "SELECT * FROM recommenduserid WHERE bbsID = ? AND userID = ?";
        const param = [bbsID, userID]

        const query1 = new Promise((resolve, reject) => {
            conn.query(sql, param,
                (err, rows, fields) => {
                    if (err) {
                        reject("select");
                    } else if( rows.length === 1) reject("already")
                    else {resolve(rows);}
                });
        });
        flg === "good" ? sql = "UPDATE recommend SET bbsGood = bbsGood + 1 WHERE bbsID = ?" :
        sql = "UPDATE recommend SET bbsBad = bbsBad + 1 WHERE bbsID = ?"
        const promises = [
            bbsPromise(
                conn,
                "INSERT INTO recommenduserid(bbsID, userID, date) VALUES (?, ?, NOW())",
                [bbsID, userID],
                false,
                res
             ),
             bbsPromise(
                conn,
                sql,
                [bbsID],
                false,
                res
             )
        ];

        query1.then( () => {
            Promise.all(promises)
                .then(
                    () => {
                        res.send(true);
                        conn.commit();}           
                )
                .catch(
                    () => {
                        conn.rollback();
                        res.send("error");
                    }
                )
            }
        )
        .catch(error =>{
            conn.rollback();
            res.send("already");
            }
        )
        conn.release();
    })
})
router.post("/bbsListInsert", async (req, res) => {
    const { bbsTitle, bbsContent } = req.body;
    let bbsID = await getMaxbbsID();
    bbsID === null ? bbsID = 1 : null;
    getConnection(async (conn) => {

        conn.beginTransaction();
        const query1 = bbsPromise(conn,
            "INSERT INTO bbs(bbsID, bbsTitle, userID, bbsDate, bbsContent, bbsAvailable) VALUES (?, ?, ?, NOW(), ?, ?)",
            [bbsID, bbsTitle, jwt.verify(req.cookies.jwt, "1234").userID, bbsContent, 1],
            false,
            res)

        query1.then( () => {
            return bbsPromise(
                conn,
                "INSERT INTO recommend(bbsID, bbsGood, bbsBad) VALUES (?, ?, ?)",
                [bbsID, 0, 0],
                true,
                res
             )
            }
        )
        .catch(error =>{
            console.log("rollback");
            conn.rollback();
            res.send(false);
            }
        )
        conn.release();
    })
})

//콜백지옥
// router.post("/bbsListInsert", async (req, res) => {
//     const { bbsTitle, bbsContent } = req.body;
//     const bbsID = await getMaxbbsID();
//     getConnection(async (conn) => {
//         try {
//             conn.beginTransaction();       
//             let sql = "INSERT INTO bbs(bbsID, bbsTitle, userID, bbsDate, bbsContent, bbsAvailable) VALUES (?, ?, ?, NOW(), ?, ?)";
//             conn.query(sql, [bbsID, bbsTitle, jwt.verify(req.cookies.jwt, "1234").userID, bbsContent, 1],
//                 (err, rows, fields) => {
//                     if (err) { 
//                         conn.rollback();
//                         res.send(false);
//                         conn.release();
//                      }
//                     else {
//                         sql = "INSERT INTO recommend(bbsID, bbsGood, bbsBad) VALUES (?, ?, ?)";
//                         conn.query(sql, [bbsID, 0, 0],
//                             (err, rows, fields) => {
//                                 if (err) { 
//                                     conn.rollback();
//                                     res.send(false);                           
//                                     conn.release();

//                                 }
//                                 else {
//                                     res.send(true);
//                                     conn.commit();
//                                     conn.release();         
//                                 }
//                         }) 
//                     }        
//                 })
//         } catch (err) {          
//         }
//     })
// })



router.post("/bbsDelete", async (req, res) => {
    try {
        const { bbsID } = req.body;

        getConnection((conn) => {
            const sql = "UPDATE bbs SET bbsAvailable = 0 WHERE bbsID = ?";
            conn.query(sql, [bbsID],
                (err, rows, fields) => {
                    if (err) { throw err }
                    else res.send(true);
                    conn.release();
                })
        })

    } catch (error) {
        res.send(false);
    }
})

router.post("/bbsUpdate", async (req, res) => {
    try {
        const { bbsID, bbsTitle, bbsContent } = req.body;

        getConnection((conn) => {
            const sql = "UPDATE bbs SET bbsTitle = ?, bbsContent = ? WHERE bbsID = ?";
            conn.query(sql, [bbsTitle, bbsContent, bbsID],
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
router.post("/selectreReplyData", async (req, res) => {
    const { bbsID, page } = req.body;
    const replyID = await getMaxReplyID(bbsID) - 1;
    let param = [bbsID, replyID - ((page + 1) * 5), replyID - (page * 5)];
    let sql = "SELECT * FROM rereply WHERE rereplyAvailable = 1 AND bbsID = ? AND replyID > ? AND replyID<=?";
    getConnection((conn) => {
        conn.query(sql, param,
            (err, rows, fields) => {
                console.log(rows);
                if (err) { res.send(false); console.log(err); }
                else res.send(rows);
                conn.release();
            })
    })

})
router.post("/selectreReply", async (req, res) => {
    const { bbsID, replyID } = req.body;

    let param = [bbsID, replyID ];
    let sql = "SELECT * FROM rereply WHERE rereplyAvailable = 1 AND bbsID = ? AND replyID= ?";
    getConnection((conn) => {
        conn.query(sql, param,
            (err, rows, fields) => {
                console.log(rows);
                if (err) { res.send(false); console.log(err); }
                else res.send(rows);
                conn.release();
            })
    })

})


router.post("/selectreplyTotal", (req, res) => {
    const { bbsID } = req.body;
    let param = [bbsID];
    let sql = "SELECT count(*) AS TOTAL FROM reply WHERE replyAvailable = 1 AND bbsID = ?";
    getConnection((conn) => {
        conn.query(sql, param,
            (err, rows, fields) => {
                if (err) { res.send(false); console.log(err); }
                else res.send(rows);
                conn.release();
            })
    })

})

async function getMaxReplyID(bbsID) {
    return new Promise((resolve, reject) => {
        getConnection((conn) => {
            const sql = "SELECT MAX(replyID)+1 AS max FROM reply WHERE bbsID = ?";
            conn.query(sql, [bbsID], (err, rows, fields) => {
                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }
                conn.release();
                let result = rows[0].max;
                if (result === null) result = 1
                resolve(result);
            });
        });
    });

}

async function getMaxReReplyID(bbsID,replyID) {
    return new Promise((resolve, reject) => {
        getConnection((conn) => {
            const sql = "SELECT MAX(rereplyID)+1 AS max FROM rereply WHERE bbsID = ? AND replyID = ?";
            conn.query(sql, [bbsID,replyID], (err, rows, fields) => {
                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }
                conn.release();
                let result = rows[0].max;
                if (result === null) result = 1
                resolve(result);
            });
        });
    });

}

router.post("/insertreReply", async (req, res) => {
    const { bbsID, replyID,  userID, replyContent } = req.body;
    const rereplyID = await getMaxReReplyID(bbsID,replyID);
    let param = [bbsID, replyID, rereplyID, userID, replyContent, 1];
    let sql = "INSERT INTO rereply (bbsID, replyID, rereplyID, userID, rereplyContent, rereplyDate, rereplyAvailable) VALUES  (?, ?, ?, ?, ?, NOW(), ?)";
    getConnection((conn) => {
        conn.query(sql, param,
            (err, rows, fields) => {
                if (err) { res.send(false); console.log(err); }
                else res.send(rows);
                conn.release();
            })
    })

})

router.post("/insertReply", async (req, res) => {
    const { bbsID, userID, replyContent } = req.body;
    const replyID = await getMaxReplyID(bbsID);
    let param = [bbsID, replyID, userID, replyContent, 1];
    let sql = "INSERT INTO reply (bbsID, replyID, userID, replyContent, replyDate, replyAvailable) VALUES  (?, ?, ?, ?, NOW(), ?)";
    getConnection((conn) => {
        conn.query(sql, param,
            (err, rows, fields) => {
                if (err) { res.send(false); console.log(err); }
                else res.send(rows);
                conn.release();
            })
    })

})

router.post("/selectReplyData", (req, res) => {
    const { bbsID, page } = req.body;
    let param = [bbsID, 5 * (page), 5];
    let sql = "SELECT replyID, userID, replyContent, replyDate FROM reply WHERE replyAvailable = 1 AND bbsID = ?  ORDER BY replyID DESC limit ?, ?";
    getConnection((conn) => {
        conn.query(sql, param,
            (err, rows, fields) => {
                if (err) { res.send(false); console.log(err); }
                else res.send(rows);
                conn.release();
            })
    })

})

router.post("/selectrecommend", (req, res) => {
    const { bbsID } = req.body;
    let param = [bbsID];
    let sql = "SELECT * FROM recommend WHERE bbsID = ?";
    getConnection((conn) => {
        conn.query(sql, param,
            (err, rows, fields) => {
                if (err) { res.send(false); console.log(err); }
                else res.send(rows);
                conn.release();
            })
    })

})

router.post("/bbsConditionList", (req, res) => {
    const { title, userID, startDate, endDate, limit, page, orderTarget, orderValue } = req.body;
    let param = [];
    let sql = "SELECT bbsID, bbsTitle, userID, bbsDate, bbsContent FROM bbs WHERE bbsAvailable = 1 ";
    if (title !== '') { sql += 'AND bbsTitle LIKE ?'; param.push(`%${title}%`) }
    if (userID !== '') { sql += 'AND userID = ?'; param.push(userID) }
    if (startDate !== null) { sql += 'AND bbsDate >= ?'; param.push(startDate) }
    if (endDate !== null) { sql += 'AND bbsDate <= ?'; param.push(endDate) }
    sql += `ORDER BY ${orderTarget} ${orderValue} LIMIT ?, ?`;
    param.push(limit * (page - 1));
    param.push(limit);
    getConnection((conn) => {
        conn.query(sql, param,
            (err, rows, fields) => {
                if (err) { res.send(false); console.log(err); }
                else res.send(rows);
                conn.release();
            })
    })

})

router.post("/selectBbsIDInfo", (req, res) => {
    const { bbsID } = req.body;
    getConnection((conn) => {
        const sql = "SELECT * FROM bbs WHERE bbsAvailable = 1 AND bbsID = ?";
        conn.query(sql, [bbsID],
            (err, rows, fields) => {
                if (err) { res.send(false); console.log(err); }
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