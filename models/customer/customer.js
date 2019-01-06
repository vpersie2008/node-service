const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const CustomerSchema = new Schema({
    loginName: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    },
    inDate: {
        type: Date,
        default: Date.now
    },
    editDate: {
        type: Date,
        default: Date.now
    },
    editUser: {
        type: String,
        default: "MBL"
    },
    companyCode: {
        type: Number,
        default: 1003
    },
    countryCode: {
        type: String,
        default: "CHN"
    },
    languageCode: {
        type: String,
        default: "zh-cn"
    }
});

module.exports = Customer = mongoose.model("customer", CustomerSchema);