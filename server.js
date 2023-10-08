const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 5000;
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
// 정적 파일 제공 설정
app.use('/upload', express.static('./upload'));

app.use(cookieParser()); // 쿠키 파싱 설정
app.use(cors({
    origin: true, // 출처 허용 옵션
    credentials:true
}));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '../build/index.html'));
});
app.use(bodyParser.json()); // 클라이언트가 보낸 json 형식의 문자열을 파싱하여 req.body에 저장한다.
app.use(bodyParser.urlencoded({extended:true}));
const data = fs.readFileSync('./database.json');
const conf = JSON.parse(data);
const mysql = require('mysql');

app.use("/member", require("./routes/memberRouter"));
app.use("/board", require("./routes/boardRouter"));
app.use("/profile", require("./routes/profileRouter"));
app.use("/history", require("./routes/historyRouter"));
app.listen(port, () => console.log(`Listening on port ${port}`));
