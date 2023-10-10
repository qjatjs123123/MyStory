const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const getConnection = require('../db');
const multer = require('multer');
const upload = multer({ dest: './upload' })


router.post('/bbsContentImage', upload.single('img'), (req, res) => {
    // 해당 라우터가 정상적으로 작동하면 public/uploads에 이미지가 업로드된다.
    // 업로드된 이미지의 URL 경로를 프론트엔드로 반환한다.
    console.log('전달받은 파일', req.file);
    console.log('저장된 파일의 이름', req.file.filename);

    // 파일이 저장된 경로를 클라이언트에게 반환해준다.
    const IMG_URL = process.env.REAL_URL + '/upload/' + req.file.filename;;
    console.log(IMG_URL);
    res.send({ url: IMG_URL });
});

router.post("/bbsListCount", (req, res) => {
    getConnection((conn) => {
        const {userID, curtab, option, input,limit, page, orderTarget, orderValue } = req.body;
        let param = [] 
        if (input != '')
            param.push(`${input}%`);
        let sql = "SELECT COUNT(*) AS COUNT FROM bbs,member,recommend WHERE bbs.userID = member.userID AND bbs.bbsID = recommend.bbsID  AND bbsAvailable = 1 "; 
        if (option == '아이디' && input != '') sql += "AND bbs.userID LIKE ? "
        else if(option =='제목' && input != '') sql += "AND bbs.bbsTitle LIKE ? "
        if(curtab=='myboard'){sql += "AND bbs.userID = ? ";
        
        param.push(userID);}
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

function bbsPromise(conn, sql, param, isFinish, res) {
    return new Promise((resolve, reject) => {
        conn.query(sql, param,
            (err, rows, fields) => {
                if (err) {
                    console.log(err);
                    reject(err);
                } else {
                    if (isFinish) {
                        console.log("commit")
                        res.send(true);
                        conn.commit();
                    }
                    resolve(rows);
                }
            });
    });
}


router.post("/insertRecommend", async (req, res) => {
    const { bbsID, userID, flg } = req.body;
    getConnection(async (conn) => {
        conn.beginTransaction();
        let sql = "SELECT * FROM recommenduserid WHERE bbsID = ? AND userID = ?";
        const param = [bbsID, userID]

        const query1 = new Promise((resolve, reject) => {
            conn.query(sql, param,
                (err, rows, fields) => {
                    if (err) {
                        reject("select");
                    } else if (rows.length === 1) reject("already")
                    else { resolve(rows); }
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

        query1.then(() => {
            Promise.all(promises)
                .then(
                    () => {
                        res.send(true);
                        conn.commit();
                    }
                )
                .catch(
                    () => {
                        conn.rollback();
                        res.send("error");
                    }
                )
        }
        )
            .catch(error => {
                conn.rollback();
                res.send("already");
            }
            )
        conn.release();
    })
})

router.post("/bbsListInsert", async (req, res) => {
    const { bbsTitle, bbsContent,bbsImage, hashTag} = req.body;
    let bbsID = await getMaxbbsID();
    bbsID === null ? bbsID = 1 : null;
    getConnection(async (conn) => {

        conn.beginTransaction((err)=>{
            if (err) res.send(false);;
            const query1 = bbsPromise(conn,
                "INSERT INTO bbs(bbsID, bbsTitle, userID, bbsDate, bbsContent, bbsAvailable,bbsImage) VALUES (?, ?, ?, NOW(), ?, ?, ?)",
                [bbsID, bbsTitle, jwt.verify(req.cookies.jwt, "1234").userID, bbsContent, 1, bbsImage],
                false,
                res)
                query1.then(() => {
                    return bbsPromise(
                        conn,
                        "INSERT INTO recommend(bbsID, bbsGood, bbsBad) VALUES (?, ?, ?)",
                        [bbsID, 0, 0],
                        false,
                        res
                    )
                }).then(()=>{
                    return bbsPromise(
                        conn,
                        "INSERT INTO history(bbsID, userID,historyDate) VALUES (?, ?, NOW())",
                        [bbsID, jwt.verify(req.cookies.jwt, "1234").userID],
                        false,
                        res
                    )
                })
                .then(()=>{
                    return bbsPromise(
                        conn,
                        "INSERT INTO hashtagpost(userID, bbsID) VALUES (?, ?)",
                        [jwt.verify(req.cookies.jwt, "1234").userID, bbsID],
                        false,
                        res
                    )
                })
                .then((rows) => {
                    const promises = hashTag.map((tag) => {
                        return bbsPromise(
                            conn,
                            "INSERT INTO hashtag(hashTagID, hashTag) VALUES (?, ?)",
                            [rows.insertId, tag],
                            false,
                            res
                        )
                    })
                    Promise.all(promises)
                        .then(
                            () => {
                                res.send(true);
                                conn.commit();
                            })
                        .catch(
                            (err) => {
                                reject(err);
                                //return conn.rollback();      
                            })
                })
                .catch(error => {
                    console.log("rollback");
                    conn.rollback();
                    res.send(false);
                })
        })
        
        conn.release();
    })
})
// router.post("/bbsListInsert", async (req, res) => {
//     const { bbsTitle, bbsContent } = req.body;
//     let bbsID = await getMaxbbsID();
//     bbsID === null ? bbsID = 1 : null;
//     getConnection(async (conn) => {

//         conn.beginTransaction();
//         const query1 = bbsPromise(conn,
//             "INSERT INTO bbs(bbsID, bbsTitle, userID, bbsDate, bbsContent, bbsAvailable) VALUES (?, ?, ?, NOW(), ?, ?)",
//             [bbsID, bbsTitle, jwt.verify(req.cookies.jwt, "1234").userID, bbsContent, 1],
//             false,
//             res)

//         query1.then(() => {
//             return bbsPromise(
//                 conn,
//                 "INSERT INTO recommend(bbsID, bbsGood, bbsBad) VALUES (?, ?, ?)",
//                 [bbsID, 0, 0],
//                 true,
//                 res
//             )
//         }
//         )
//             .catch(error => {
//                 console.log("rollback");
//                 conn.rollback();
//                 res.send(false);
//             }
//             )
//         conn.release();
//     })
// })

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

router.post("/getTags", async (req, res) => {
    try {
        const { bbsID } = req.body;

        getConnection((conn) => {
            const sql = "SELECT hashTag FROM hashtagpost, hashtag WHERE hashtagpost.bbsID = ? AND hashtagpost.hashTagID = hashtag.hashTagID";
            conn.query(sql, [bbsID],
                (err, rows, fields) => {
                    if (err) { res.send(false); }
                    else res.send(rows);
                    conn.release();
                })
        })

    } catch (error) {
        res.send(false);
    }
})
router.post("/bbsDelete", async (req, res) => {
    try {
        const { bbsID } = req.body;

        getConnection((conn) => {
            const sql = "UPDATE bbs SET bbsAvailable = 0 WHERE bbsID = ?";
            conn.query(sql, [bbsID],
                (err, rows, fields) => {
                    if (err) { res.send(false);}
                    else res.send(true);
                    conn.release();
                })
        })

    } catch (error) {
        res.send(false);
    }
})
function ReplyPromise(conn, sql, param, isFinish, res) {
    return new Promise((resolve, reject) => {
        conn.query(sql, param,
            (err, rows, fields) => {
                if (err) {
                    console.log("reject");
                    reject(err);
                } else {
                    if (isFinish) {
                        res.send(rows);
                        conn.commit();
                    }
                    resolve(rows);
                }
            });
    });
}
router.post("/replyUpdate", (req, res) => {

    const { bbsID, replyID, replyContent } = req.body;
    getConnection(async (conn) => {
        conn.beginTransaction();
        const query1 = ReplyPromise(conn,
            "UPDATE reply SET replyContent = ? WHERE bbsID = ? AND replyID = ?",
            [replyContent, bbsID, replyID],
            false,
            res)
        query1.then(() => {
            return ReplyPromise(
                conn,
                "SELECT * FROM reply WHERE bbsID = ? AND replyID = ?",
                [bbsID, replyID],
                true,
                res
            )
        })
            .catch(error => {
                console.log("rollback");
                conn.rollback();
                res.send(false);
            }
            )
        conn.release();
    })

})


router.post("/rereplyUpdate", async (req, res) => {
    try {
        const { bbsID, replyID, rereplyID, rereplyContent } = req.body;
        getConnection((conn) => {
            const sql = "UPDATE rereply SET rereplyContent = ? WHERE bbsID = ? AND replyID = ? AND rereplyID = ?";
            conn.query(sql, [rereplyContent, bbsID, replyID, rereplyID],
                (err, rows, fields) => {
                    if (err) { res.send(false); }
                    else res.send(true);
                    conn.release();
                })
        })
    } catch (error) {
        res.send(false);
    }
})

router.post("/replyDelete", async (req, res) => {
    try {
        const { bbsID, replyID } = req.body;
        getConnection((conn) => {
            const sql = "UPDATE reply SET replyAvailable = 0 WHERE bbsID = ? AND replyID = ?";
            conn.query(sql, [bbsID, replyID],
                (err, rows, fields) => {
                    if (err) { res.send(false);}
                    else res.send(true);
                    conn.release();
                })
        })
    } catch (error) {
        res.send(false);
    }
})

router.post("/rereplyDelete", async (req, res) => {
    try {
        const { bbsID, replyID, rereplyID } = req.body;
        getConnection((conn) => {
            const sql = "UPDATE rereply SET rereplyAvailable = 0 WHERE bbsID = ? AND replyID = ? AND rereplyID = ?";
            conn.query(sql, [bbsID, replyID, rereplyID],
                (err, rows, fields) => {
                    if (err) { res.send(false); }
                    else res.send(true);
                    conn.release();
                })
        })
    } catch (error) {
        res.send(false);
    }
})


router.post("/bbsUpdate", async (req, res) => {
    const { bbsID, bbsTitle, bbsContent,bbsImage, hashTag } = req.body;

    getConnection(async (conn) => {
        conn.beginTransaction((err)=>{
            if (err) res.send(false);;
            const query1 = bbsPromise(conn,
                `DELETE FROM hashtag WHERE hashTagID = 
                (SELECT hashTagID FROM hashtagpost WHERE bbsID = ?)`,
                [bbsID],
                false,
                res)
                query1.then(() => {
                    return bbsPromise(
                        conn,
                        "UPDATE bbs SET bbsTitle = ?, bbsContent = ?, bbsImage = ? WHERE bbsID = ? ",
                        [bbsTitle, bbsContent, bbsImage, bbsID],
                        false,
                        res
                    )
                }).then(()=>{
                    return bbsPromise(
                        conn,
                        "SELECT hashTagID FROM hashtagpost WHERE bbsID = ?",
                        [bbsID],
                        false,
                        res
                    )
                })
                .then((rows) => {

                    const promises = hashTag.map((tag) => {
                        return bbsPromise(
                            conn,
                            "INSERT INTO hashtag(hashTagID, hashTag) VALUES (?, ?)",
                            [rows[0].hashTagID, tag],
                            false,
                            res
                        )
                    })
                    Promise.all(promises)
                        .then(
                            () => {
                                res.send(true);
                                conn.commit();
                            })
                        .catch(
                            (err) => {
                                reject(err);
                                //return conn.rollback();      
                            })
                })
                .catch(error => {
                    console.log("rollback");
                    conn.rollback();
                    res.send(false);
                })
        })
        
        conn.release();
    })
})


router.post("/bbsUpdate", async (req, res) => {
    try {
        const { bbsID, bbsTitle, bbsContent,bbsImage, hashTag} = req.body;
        console.log(bbsID, bbsTitle, bbsContent,bbsImage, hashTag);
        getConnection((conn) => {
            const sql = "UPDATE bbs SET bbsTitle = ?, bbsContent = ?, bbsImage = ? WHERE bbsID = ? ";
            conn.query(sql, [bbsTitle, bbsContent, bbsImage, hashTag,bbsID],
                (err, rows, fields) => {
                    if (err) { res.send(false);  console.log(err)}
                    else res.send(rows);
                    conn.release();
                })
        })

    } catch (error) {
        res.send(false);
    }


})
router.post("/selectreReplyData", async (req, res) => {
    try{
    const { bbsID, page } = req.body;
    const replyID = await getMaxReplyID(bbsID) - 1;
    let param = [bbsID, replyID - ((page + 1) * 5), replyID - (page * 5)];
    let sql = "SELECT * FROM rereply WHERE rereplyAvailable = 1 AND bbsID = ? AND replyID > ? AND replyID<=?";
    getConnection((conn) => {
        conn.query(sql, param,
            (err, rows, fields) => {
                if (err) { res.send(false);; console.log(err); }
                else res.send(rows);
                conn.release();
            })
    })}catch(err){
        res.send(false)
    }

})
router.post("/selectreReply", async (req, res) => {
    try{
        const { bbsID, replyID } = req.body;

        let param = [bbsID, replyID];
        let sql = "SELECT * FROM rereply WHERE rereplyAvailable = 1 AND bbsID = ? AND replyID= ?";
        getConnection((conn) => {
            conn.query(sql, param,
                (err, rows, fields) => {
                    console.log(rows);
                    if (err) { res.send(false);; console.log(err); }
                    else res.send(rows);
                    conn.release();
                })
        })
    }catch(err){
        res.send(false)
    }

})


router.post("/selectreplyTotal", (req, res) => {
    try{
    const { bbsID } = req.body;
    let param = [bbsID];
    let sql = "SELECT count(*) AS TOTAL FROM reply WHERE replyAvailable = 1 AND bbsID = ?";
    getConnection((conn) => {
        conn.query(sql, param,
            (err, rows, fields) => {
                if (err) { res.send(false);; console.log(err); }
                else res.send(rows);
                conn.release();
            })
    })
}catch(err){
    res.send(false)
}

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

async function getMaxReReplyID(bbsID, replyID) {
    return new Promise((resolve, reject) => {
        getConnection((conn) => {
            const sql = "SELECT MAX(rereplyID)+1 AS max FROM rereply WHERE bbsID = ? AND replyID = ?";
            conn.query(sql, [bbsID, replyID], (err, rows, fields) => {
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
    try{
    const { bbsID, replyID, userID, replyContent } = req.body;
    const rereplyID = await getMaxReReplyID(bbsID, replyID);
    let param = [bbsID, replyID, rereplyID, userID, replyContent, 1];
    let sql = "INSERT INTO rereply (bbsID, replyID, rereplyID, userID, rereplyContent, rereplyDate, rereplyAvailable) VALUES  (?, ?, ?, ?, ?, NOW(), ?)";
    getConnection((conn) => {
        conn.query(sql, param,
            (err, rows, fields) => {
                if (err) { res.send(false);; console.log(err); }
                else res.send(rows);
                conn.release();
            })
    })}catch(err) {
        res.send(false)
    }

})

router.post("/insertReply", async (req, res) => {
    try{
    const { bbsID, userID, replyContent } = req.body;
    const replyID = await getMaxReplyID(bbsID);
    let param = [bbsID, replyID, userID, replyContent, 1];
    let sql = "INSERT INTO reply (bbsID, replyID, userID, replyContent, replyDate, replyAvailable) VALUES  (?, ?, ?, ?, NOW(), ?)";
    getConnection((conn) => {
        conn.query(sql, param,
            (err, rows, fields) => {
                if (err) { res.send(false);; console.log(err); }
                else res.send(rows);
                conn.release();
            })
    })}catch(err){
        res.send(false)
    }

})

router.post("/selectReplyData", (req, res) => {
    try{
        const { bbsID, page } = req.body;
        let param = [bbsID, 5 * (page), 5];
        let sql = "SELECT replyID, userID, replyContent, replyDate FROM reply WHERE replyAvailable = 1 AND bbsID = ?  ORDER BY replyID DESC limit ?, ?";
        getConnection((conn) => {
            conn.query(sql, param,
                (err, rows, fields) => {
                    if (err) { res.send(false);; console.log(err); }
                    else res.send(rows);
                    conn.release();
                    
                })
        })
    }catch(err) {
        res.send(false)
    }
    
})

router.post("/selectrecommend", (req, res) => {
    try{
    const { bbsID } = req.body;
    let param = [bbsID];
    let sql = "SELECT * FROM recommend WHERE bbsID = ?";
    getConnection((conn) => {
        conn.query(sql, param,
            (err, rows, fields) => {
                if (err) { res.send(false);; console.log(err); }
                else res.send(rows);
                conn.release();
            })
    })
    }catch(err){
        res.send(false);      
    }
    
})
router.post("/bbsConditionList", (req, res) => {
    try{
        const {userID, curtab, option, input,limit, page, orderTarget, orderValue } = req.body;
        
        let param = [] 
        if (input != '')
            param.push(`${input}%`);
        let sql = "SELECT * FROM bbs,member,recommend WHERE bbs.userID = member.userID AND bbs.bbsID = recommend.bbsID  AND bbsAvailable = 1 "; 
        if (option == '아이디' && input != '') sql += "AND bbs.userID LIKE ? "
        else if(option =='제목' && input != '') sql += "AND bbs.bbsTitle LIKE ? "
        if (curtab == 'myboard') {sql += "AND bbs.userID = ? ";
        param.push(userID);
        }
        sql += `ORDER BY bbs.${orderTarget} ${orderValue} LIMIT ?, ?`;
        
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
    }catch(err){
        res.send(false)
    }
    
})
// router.post("/bbsConditionList", (req, res) => {
//     const { title, userID, startDate, endDate, limit, page, orderTarget, orderValue } = req.body;
//     let param = [];
//     let sql = "SELECT * FROM bbs,member,recommend WHERE bbs.userID = member.userID AND bbs.bbsID = recommend.bbsID  AND bbsAvailable = 1 ";
//     if (title !== '') { sql += 'AND bbsTitle LIKE ?'; param.push(`%${title}%`) }
//     if (userID !== '') { sql += 'AND userID = ?'; param.push(userID) }
//     if (startDate !== null) { sql += 'AND bbsDate >= ?'; param.push(startDate) }
//     if (endDate !== null) { sql += 'AND bbsDate <= ?'; param.push(endDate) }
//     sql += `ORDER BY bbs.${orderTarget} ${orderValue} LIMIT ?, ?`;
//     param.push(limit * (page - 1));
//     param.push(limit);
//     getConnection((conn) => {
//         conn.query(sql, param,
//             (err, rows, fields) => {
//                 if (err) { res.send(false); console.log(err); }
//                 else res.send(rows);
//                 conn.release();
//             })
//     })

// })

router.post("/bbsConditionInput", (req, res) => {
    try{
        const { userID,curtab,option, input,limit, page, orderTarget, orderValue } = req.body;
        console.log(userID,curtab,option, input, "qw")
        let param = [];
        param.push(`${input}`);
        let sql = "SELECT  * FROM bbs,member,recommend, hashtagpost, hashtag WHERE bbs.userID = member.userID AND bbs.bbsID = recommend.bbsID AND bbs.bbsID = hashtagpost.bbsID AND hashtag.hashTagID = hashtagpost.hashTagID AND bbsAvailable = 1 ";
        sql += "AND hashtag.hashTag = ?"
        if(curtab=='myboard'){sql += "AND bbs.userID = ? "; param.push(userID);}
        sql += `ORDER BY bbs.${orderTarget} ${orderValue} LIMIT ?, ?`;
        param.push(limit * (page - 1));
        param.push(limit);
        getConnection((conn) => {
            conn.query(sql, param,
                (err, rows, fields) => {
                    if (err) { res.send(false); }
                    else res.send(rows);
                    conn.release();
                })
        })
    }catch(e){
        res.send(false);
    }
})

router.post("/bbsConditionInputCount", (req, res) => {
    try{
        const { userID,curtab,option, input,limit, page, orderTarget, orderValue } = req.body;
        let param = [`${input}`];
        let sql = "SELECT COUNT(*) AS COUNT FROM bbs,member,recommend, hashtagpost, hashtag WHERE bbs.userID = member.userID AND bbs.bbsID = recommend.bbsID AND bbs.bbsID = hashtagpost.bbsID AND hashtag.hashTagID = hashtagpost.hashTagID AND bbsAvailable = 1 ";
        sql += "AND hashtag.hashTag = ?"
        if(curtab=='myboard'){sql += "AND bbs.userID = ? "; param.push(userID);}
        param.push(limit * (page - 1));
        param.push(limit);
        getConnection((conn) => {
            conn.query(sql, param,
                (err, rows, fields) => {
                    if (err) { res.send(false);; console.log(err); }
                    else res.send(rows);  
                    conn.release();               
                })
        })
    }catch(e) {
        res.send(false);
    }
    
})

router.post("/selectBbsIDInfo", (req, res) => {
    try{
    const { bbsID } = req.body;
    getConnection((conn) => {
        const sql = `SELECT bbs.bbsID, bbsTitle, bbs.userID, bbsDate, bbsContent, bbsImage, hashTag FROM bbs, hashtag, hashtagpost WHERE bbs.bbsID = hashtagpost.bbsID AND hashtagpost.hashTagID = hashtag.hashTagID AND bbs.bbsID = ?`;
        conn.query(sql, [bbsID],
            (err, rows, fields) => {
                if (err) { res.send(false); console.log(err); }
                else res.send(rows);
                conn.release();
            })
    })
    }catch(e){
        res.send(false);
    }

})


router.post("/loginCheck", (req, res) => {
    try {
        console.log(jwt.verify(req.cookies.jwt, "1234"));
        const verified = jwt.verify(req.cookies.jwt, "1234");
        res.send({
            userID:jwt.verify(req.cookies.jwt, "1234").userID,
            userNickname:jwt.verify(req.cookies.jwt, "1234").userNickname,
            userState:jwt.verify(req.cookies.jwt, "1234").userState,
            userProfile:jwt.verify(req.cookies.jwt, "1234").userProfile
    });
    } catch (err) {
        res.send(false);
    }
})

router.post("/getTimer", (req, res) => {
    try {
        const userID = jwt.verify(req.cookies.jwt, "1234").userID;
        getConnection((conn) => {
            const sql = "SELECT TIMESTAMPDIFF(SECOND, userLoginTime , NOW()) AS TIMER, userLoginTime FROM member WHERE userID = ?";
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