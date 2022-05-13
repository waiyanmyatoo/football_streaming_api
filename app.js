const express = require('express')
const app = express()
const { v4 } = require("uuid");

const cors = require("cors");
const schedule_router = require(__dirname + "/routers/schedule_router.js");

const port = 3000;

app.use(cors());

app.get('/', function (req, res) {
    res.send("hello world");
});

app.use("/api", schedule_router);


app.listen(port, function () {
    return console.log(`Example app listening on port ${port}!`);
});