const express = require("express");
const router = express.Router();
const logger = require("../../common/logHelpper");
const HttpProxy = require("../../common/httpProxy");
const customerService = new HttpProxy("CustomerService");
const postService = new HttpProxy("PostsService");
const CustomerFacade = require("../../infrastructure/customer/customer");
const jwtAuth = require("../../infrastructure/utility/passport");

router.get("/test", (req, res) => {
    customerService
        .GET("GetAllUsers")
        .then(data => {
            res.json(data);
        });
})

router.get("/posts/:id", (req, res) => {
    customerService
        .GET("GetPostDataById", [
            {
                key: "id",
                value: req.params.id
            }
        ])
        .then(data => {
            res.json(data);
        });
})

router.post("/posts", (req, res) => {
    postService
        .POST("Posts", req.body)
        .then((data) => {
            res.json({ success: true, msg: "Add review success." });
        })
        .catch(err => {
            res.json({ success: false, msg: `Add review failed. ${err}` })
        })
})

router.post("/register", (req, res) => {
    CustomerFacade
        .register(req.body)
        .then((response) => {
            res.json(response);
        }).catch((err) => {
            logger.error(`Register failed, Error : ${err}`);
            res.json(response);
        });
});

router.post("/login", (req, res) => {
    CustomerFacade.login(req.body)
        .then((response) => {
            res.json(response);
        }).catch((err) => {
            logger.error(`Login failed, Error : ${err}`);
            res.json(response);
        });
})

router.post("/current", jwtAuth.JwtAuth(), (req, res) => {

    const result = {
        id: req.user.id,
        name: req.user.name,
        email: req.user.email
    };

    console.log("The request form login data is ::" + JSON.stringify(req.user));

    return res.json({ "success": true });

});

router.get("/:loginName", jwtAuth.JwtAuth(), (req, res) => {
    CustomerFacade.getCustomerByLoginName(req.params.loginName).then(response => {
        res.json(response);
    }).catch(err => {
        logger.error(`Get customer data by login name failed.`);
        res.json(response);
    })
})

module.exports = router;