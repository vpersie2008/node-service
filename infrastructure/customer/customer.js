const CustomerDAL = require("./customerDAL");
const bcrypt = require("bcrypt");
const validator = require("./validator");

class CustomerFacade {

    async register(request) {
        let response = {
            message: "注册失败",
            status: false
        };

        const validateResult = validator.validateRegister(request);
        if (!validateResult.status) {
            return {message: validateResult.message, status: false};
        }

        let isExist = await CustomerDAL.customerIsExist(request.loginName);
        if (isExist) {
            return {message: "该用户已被注册！", status: true};
        }

        request.password = bcrypt.hashSync(request.password, 10);
        const updateResult = await CustomerDAL.updateCustomer(request);
        if (updateResult.success) {
            return {message: "注册成功！", status: true};
        }

        return response;

    };

    login() {}
}

module.exports = CustomerFacade;