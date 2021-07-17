const Customer = require("../../models/customer/customer");

class CustomerDAL {
    async updateCustomer(customer) {

        if (!customer) {
            return { success: false, message: "Customer is empty" }
        }

        const currentCustomer = new Customer({
            loginName: customer.loginName,
            name: customer.name,
            phone: customer.phone,
            email: customer.email,
            password: customer.password,
            avatar: customer.password,
            inDate: customer.inDate,
            editDate: customer.editDate,
            editUser: customer.editUser,
            companyCode: customer.companyCode,
            countryCode: customer.countryCode,
            languageCode: customer.languageCode
        });

        return await currentCustomer
            .save()
            .then(user => {
                console.log("start save customer , user is :: " + user);
                return { success: true, message: "" };
            })
            .catch(err => {
                console.log("failed save customer , user is :: " + user);
                return { success: false, message: `Save customer failed, error : ${err}` };
            });
    };

    async customerIsExist(loginName) {

        if (!loginName) {
            console.log("login name is :: " + loginName)
            return false;
        }

        const isExist = await Customer
            .findOne({ loginName: loginName })
            .then((customer) => {
                console.log("customer is :: " + customer);
                if (customer) {
                    return true;
                } else {
                    return false;
                }
            });

        return isExist;
    }

    async getCustomerByLoginName(loginName) {
        return await Customer
            .findOne({ loginName: loginName })
            .then(customer => {
                return Object.assign(customer, {
                    suatus: true,
                    message: "Get customer info success."
                });
            })
            .catch(err => {
                return { status: false, message: `Get customer failed, error : ${err}` }
            });
    }
}

module.exports = new CustomerDAL();
