const http = require("http");
const qs = require("querystring");
const fetch = require("node-fetch");

const restfulConfig = require("../configuration/restfulService");
const headerPrams = {
    "Content-Type": "application/json",
    "CountryCode": "USA",
    "CompanyCode": 1003,
    "LanguageCode": "en-us",
    "X-RegionCode": "USA",
    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVjMjIyYTA4ODRhYmUwMzdkY2I4MTdlNiIsIm5hbWUiOiJ3YW5nIHhpbmciLCJpYXQiOjE1NDYxNzI5MDQsImV4cCI6MTU0NjE3NjUwNH0.7m-ve0D9309L6vCxr8FUc-8gtw1pjSE6C_5Je7t_aIU"
}

class HttpProxy {

    constructor(serviceName) {
        this.serviceName = serviceName;
    }

    _getResourceByName(resourceName) {

        if (resourceName) {
            const resourceItem = restfulConfig.find(x => x.name === this.serviceName);
            if (resourceItem) {
                const host = resourceItem.host;
                const resourcUri = resourceItem
                    .resources
                    .find(y => y.name === resourceName)
                    .value;
                if (host && resourcUri) {
                    return `${host.trim("/")}/${resourcUri.trim("/")}`;
                }
            }
        }

        return "";
    }

    _httpRequest(url, method, requestBody) {
        console.log("current url :::: " + url);
        return new Promise((resolve, reject) => {
            fetch(url, {
                method: method,
                headers: headerPrams,
                    body: JSON.stringify(requestBody)
                })
                .then(res => res.json())
                .then(data => resolve(data))
                .catch(err => reject(err));

        })
    }

    GET(resourceName, queryBody) {
        const resourceRoute = this._getResourceByName(resourceName);
        const url = queryBody && typeof queryBody == "object"
            ? resourceRoute + "?" + qs.stringify(queryBody)
            : resourceRoute;

        console.log("Current url is :" + url);

        return new Promise((resolve, reject) => {
            fetch(url)
                .then(res => res.json())
                .then(data => resolve(data))
                .catch(err => reject(err));
        })

    }

    POST(resourceName, requestBody) {
        return this._httpRequest(this._getResourceByName(resourceName), "POST", requestBody);
    }

    PUT(resourceName, requestBody) {
        return this._httpRequest(this._getResourceByName(resourceName), "PUT", requestBody);
    }

    DELETE(resourceName, queryBody) {
        const resourceRoute = this._getResourceByName(resourceName);

        return new Promise((resolve, reject) => {
            fetch(resourceRoute, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json"
                    }
                })
                .then(res => res.json())
                .then(data => resolve({success: true, msg: "Delete successfully!"}))
                .catch(err => reject(err));

        });
    }
}

module.exports = HttpProxy;