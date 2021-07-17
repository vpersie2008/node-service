const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const bizConfig = require("../../configuration/business");
const CustomerDAL = require("./customerDAL");
const validator = require("./validator");

class CustomerFacade {

    async register(request) {
        let response = {
            message: "Register failed!",
            status: false
        };

        const validateResult = validator.validateRegister(request);
        if (!validateResult.status) {
            return { message: validateResult.message, status: false };
        }

        let isExist = await CustomerDAL.customerIsExist(request.loginName);
        if (isExist) {
            return { message: "The user has been registered!", status: true };
        }

        request.password = await bcrypt.hashSync(request.password, 10);
        const updateResult = await CustomerDAL.updateCustomer(request);
        if (updateResult.success) {
            return { message: "Register successfully!", status: true };
        }

        return response;

    };

    async login(request) {
        let response = {
            message: "Login failed!",
            status: false
        };

        const validateResult = await validator.validateLogin(request);
        if (!validateResult.status) {
            return { message: validateResult.message, status: false };
        }

        let customer = await CustomerDAL.getCustomerByLoginName(request.loginName);
        if (!customer) {
            return { message: "This customer does not exist.", status: false };
        }

        const isMatch = await bcrypt.compareSync(request.password, customer.password);
        if (isMatch) {
            const jwtToken = jwt.sign({
                id: customer.id,
                loginName: customer.loginName
            }, bizConfig.passport.secretOrKey, { expiresIn: bizConfig.passport.expiresIn });

            return { message: "Login successfully!", status: false, token: `${bizConfig.passport.bearer}${jwtToken}` };
        }

        return response;

    }

    async getCustomerByLoginName(loginName) {
        let customer = await CustomerDAL.getCustomerByLoginName(loginName);
        if (!customer) {
            return { message: "This customer does not exist.", status: false, code: 100000 };
        }

        return customer;
    }
}

module.exports = new CustomerFacade();