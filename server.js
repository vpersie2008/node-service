const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const db = require('./configuration/dataBase');
const baseRoutes = require('./routes/roures');
const serviceContext = require("./common/serviceContext");

const app = express();

//连接mongodb
mongoose
    .connect(db.mongoURI)
    .then(() => console.log(`Mongodb connected to ${db.mongoURI}`))
    .catch(err => console.log(err));

//使用body-parser parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));
//parse application/json
app.use(bodyParser.json());

//使用中间件，来允许跨域
app.use((req, res, next) => {
    let {setBizUnit} = serviceContext;
    setBizUnit({
        CountryCode: req.header("CountryCode"),
        CompanyCode: 1003,
        LanguageCode: req.header("LanguageCode"),
        RegionCode: req.header("X-RegionCode"),
        Authorization:req.header("Authorization")
    });

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    next();
});

// require("./common/httpProxy")(bizUnit);

baseRoutes.forEach(route => app.use(route.baseApi, route.controller))

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Server is running at ${port}`);
})