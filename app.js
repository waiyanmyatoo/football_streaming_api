const express = require('express')
const app = express()
const { v4 } = require("uuid");

const cors = require("cors");
const schedule_router = require(__dirname + "/routers/schedule_router.js");

app.use(cors());

app.get('/', schedule_router);

app.use("/api", schedule_router);

let port = process.env.PORT;
if (port == null || port == "") {
  port = 8000;
}

app.listen(port, function () {
    return console.log(`Example app listening on port ${port}!`);
});