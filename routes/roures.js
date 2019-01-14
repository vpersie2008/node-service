const users = require("../routes/api/users");

module.exports = {
    version: "v1",
    resources: [
        {
            baseApi: "/api/users",
            controller: users
        }
    ]
}
