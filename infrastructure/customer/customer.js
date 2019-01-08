const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const bizConfig = require("../../configuration/business");
const CustomerDAL = require("./customerDAL");
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

        request.password = await bcrypt.hashSync(request.password, 10);
        const updateResult = await CustomerDAL.updateCustomer(request);
        if (updateResult.success) {
            return {message: "注册成功！", status: true};
        }

        return response;

    };

    async login(request) {
        let response = {
            message: "登录失败",
            status: false
        };

        const validateResult = await validator.validateLogin(request);
        if (!validateResult.status) {
            return {message: validateResult.message, status: false};
        }

        let customer = await CustomerDAL.getCustomerByLoginName(request.loginName);
        if (!customer) {
            return {message: "该用户不存在", status: false};
        }

        const isMatch = await bcrypt.compareSync(request.password, customer.password);
        if (isMatch) {
            const jwtToken = jwt.sign({
                id: customer.id,
                loginName: customer.loginName
            }, bizConfig.passport.secretOrKey, {expiresIn: bizConfig.passport.expiresIn});

            return {message: "登录成功", status: false, token: `${bizConfig.passport.bearer}${jwtToken}`};
        }

        return response;

    }
}

module.exports = new CustomerFacade();