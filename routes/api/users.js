const express = require("express"); //引入express
const router = express.Router(); //获取express中的路由

router.get("/test",(req,res)=>{
    res.json({msg :"test apis"});
})

module.exports = router;