const CustomerDAL = require("./customerDAL");

class CustomerFacade {

    async register(request) {
        let response = {
            message: "注册失败",
            status: false
        };

        let isExist = await CustomerDAL.customerIsExist(request.loginName);
        if (isExist) {
            return {message: "该用户已被注册！", status: true};
        }
        
        const updateResult = await CustomerDAL.updateCustomer(request);
        if (updateResult.success) {
            return {message: "注册成功！", status: true};
        }

        return response;

    };

    login() {}
}

module.exports = CustomerFacade;