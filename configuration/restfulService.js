module.exports = [
    {
        name:"CustomerService",
        host: "http://localhost:5000",
        resources: [
            {
                name: "GetAllUsers",
                value: "/api/users/users"
            }, {
                name: "GetPostDataById",
                value: "/api/posts/{id}"
            }
        ]
    },
    {
        name:"PostsService",
        host: "http://localhost:5000",
        authorization:"Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjMjIyYTA4ODRhYmUwMzdkY2I4MTdlNiIsIm5hbWUiOiJ3YW5nIHhpbmciLCJpYXQiOjE1NDYxNjYxMTAsImV4cCI6MTU0NjE2OTcxMH0.3c3VF0ap8Nh2jzrBPp7RBz8xliHms6Ws9EzyDNK6DXk",
        resources: [
            {
                name: "GetAllPost",
                value: "/api/posts"
            },{
                name:"Posts",
                value:"api/posts"
            }
        ]
    }
]