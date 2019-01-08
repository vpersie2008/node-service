const validator = require("validator");
const validatorHelper = require("../utility/validation");

let validateFailed = {
    status: false,
    message: "Request body is empty"
}

module.exports.validateRegister = (customer) => {

    if (!customer) {
        return validateFailed;
    }

    customer.loginName = !validatorHelper.isEmpty(customer.loginName)
        ? customer.loginName
        : "";
    customer.phone = !validatorHelper.isEmpty(customer.phone)
        ? customer.phone
        : "";
    customer.email = !validatorHelper.isEmpty(customer.email)
        ? customer.email
        : "";
    customer.password = !validatorHelper.isEmpty(customer.password)
        ? customer.password
        : "";

    let {loginName, phone, email, password} = customer;

    if (validator.isEmpty(loginName)) {
        return {status: false, message: "Login name is empty!"};
    }

    if (validator.isEmpty(phone)) {
        return {status: false, message: "Cell phone is empty!"};
    }

    if (validator.isEmpty(password)) {
        return {status: false, message: "Password is empty!"};
    }

    if (!validator.isLength(loginName, {
        min: 3,
        max: 30
    })) {
        return {status: false, message: "Login name is nust in 3~ 30!"};
    }

    if (!validator.isLength(password, {
        min: 6,
        max: 30
    })) {
        return {status: false, message: "Password is nust in 6~ 30!"};
    }

    if (!validator.isEmpty(email) && !validator.isEmail(email)) {
        return {status: false, message: "Please input a valid email!"};
    }

    return {status: true, message: ""};
}

module.exports.validateLogin = (customer) => {

    if (!customer) {
        return validateFailed;
    }

    customer.loginName = !validatorHelper.isEmpty(customer.loginName)
        ? customer.loginName
        : "";
    customer.password = !validatorHelper.isEmpty(customer.password)
        ? customer.password
        : "";

    let {loginName, password} = customer;

    if (validator.isEmpty(loginName)) {
        return {status: false, message: "Login name is empty!"};
    }

    if (!validator.isLength(loginName, {
        min: 3,
        max: 30
    })) {
        return {status: false, message: "Login name is nust in 3~ 30!"};
    }

    if (validator.isEmpty(password)) {
        return {status: false, message: "Password is empty!"};
    }

    if (!validator.isLength(password, {
        min: 6,
        max: 30
    })) {
        return {status: false, message: "Password is nust in 6~ 30!"};
    }

    return {status: true, message: ""};
}