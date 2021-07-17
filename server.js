const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const db = require('./configuration/dataBase');
const environment = require("./configuration/environment");
const baseRoutes = require('./routes/roures');
const serviceContext = require("./common/serviceContext");
const passport = require("passport");
const app = express();

//Connect to mongodb
mongoose
    .connect(db.mongoURI)
    .then(() => console.log(`Mongodb connected to ${db.mongoURI}`))
    .catch(err => console.log(err));

//body-parser parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
//parse application/json
app.use(bodyParser.json());

//Use middleware for allow CORS
app.use((req, res, next) => {
    let { setBizUnit } = serviceContext;
    setBizUnit({
        CountryCode: req.header("CountryCode"),
        CompanyCode: 1003,
        LanguageCode: req.header("LanguageCode"),
        RegionCode: req.header("X-RegionCode"),
        Authorization: req.header("Authorization")
    });

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    next();
});

//Set passport to create token
app.use(passport.initialize());
require("./infrastructure/utility/passport")(passport);

//Use swagger to show api doc.
baseRoutes.resources.forEach(resource => app.use(resource.baseApi, resource.controller));
app.use(`/${baseRoutes.version}/api/`, express.static("./common/swagger-ui/"));

const port = process.env.PORT || 3000

app.listen(port, () => {
    console.log(`Server is running at ${port}`);
    console.log(`Swagger doc is: ${environment.host}/${baseRoutes.version}/api/`);
});