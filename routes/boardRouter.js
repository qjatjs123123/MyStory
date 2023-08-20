const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

const verfyCheck = (req, res) => {
    try{
        const verified = jwt.verify(req.cookies.jwt, "1234");
        return true;
    }catch(err){
        return false;
    }
}

router.post("/test", (req, res) => {
    console.log( req.cookies.jwt );
    try{
        const verified = jwt.verify(req.cookies.jwt, "1234");
        console.log(verified);
    }catch(err){
        console.log(err);
    }
})

module.exports = router;