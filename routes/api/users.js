const express = require("express"); //引入express
const router = express.Router(); //获取express中的路由
const logger = require("../../common/logHelpper");
const HttpProxy = require("../../common/httpProxy");
const customerService = new HttpProxy("CustomerService");
const postService = new HttpProxy("PostsService");
const Customer = require("../../infrastructure/customer/customer");
const CustomerFacade = new Customer();

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
})

module.exports = router;