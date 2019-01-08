const express = require("express"); //引入express
const router = express.Router(); //获取express中的路由
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
            res.json({success: true, msg: "添加评论成功"});
        })
        .catch(err => {
            res.json({success: false, msg: `添加失败 ${err}`})
        })
})

router.post("/register", (req, res) => {
    CustomerFacade
        .register(req.body)
        .then((response) => {
            res.json(response);
        }).catch((err)=>{
            logger.error(`Register failed, Error : ${err}`);
            res.json(response);
        });
});

router.post("/login", (req, res) => {
    CustomerFacade.login(req.body)
        .then((response) => {
            res.json(response);
        }).catch((err)=>{
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

    return res.json({"success":true});

});


module.exports = router;