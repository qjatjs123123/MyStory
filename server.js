const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;

app.use(bodyParser.json()); // 클라이언트가 보낸 json 형식의 문자열을 파싱하여 req.body에 저장한다.
app.use(bodyParser.urlencoded({extended:true}));

const data = fs.readFileSync('./database.json');
const conf = JSON.parse(data);
const mysql = require('mysql');

app.use("/member", require("./routes/memberRouter"));
app.use("/board", require("./routes/boardRouter"));

app.listen(port, () => console.log(`Listening on port ${port}`));
