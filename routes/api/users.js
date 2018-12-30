const express = require("express"); //引入express
const router = express.Router(); //获取express中的路由
const HttpProxy = require("../../common/httpProxy");
const customerService = new HttpProxy("CustomerService");
const postService = new HttpProxy("PostsService");

router.get("/test", (req, res) => {

    customerService
        .GET("GetAllUsers")
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

module.exports = router;