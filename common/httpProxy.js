const qs = require("querystring");
const fetch = require("node-fetch");
const restfulConfig = require("../configuration/restfulService");
const {getBizUnit} = require("./serviceContext");

class HttpProxy {

    constructor(serviceName) {
        this.serviceName = serviceName;
    }

    get _bizUnit() {
        return getBizUnit();
    }

    get _authorization() {
        if (this._bizUnit && this._bizUnit.Authorization) {
            return this._bizUnit.Authorization;
        } else {
            const resourceItem = restfulConfig.find(x => x.name === this.serviceName);
            if (resourceItem) {
                return resourceItem.authorization;
            }
        }
        return "";
    }

    get _headersPrams() {
        return {
            "Content-Type": "application/json",
            "CountryCode": this._bizUnit.CountryCode,
            "CompanyCode": this._bizUnit.CompanyCode,
            "LanguageCode": this._bizUnit.LanguageCode,
            "X-RegionCode": this._bizUnit.RegionCode,
            "Authorization": this._authorization
        }
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
        console.log("Start send http request to :: " + url);
        return new Promise((resolve, reject) => {
            fetch(url, {
                    method: method,
                    headers: this._headersPrams,
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
                    headers: _headersPrams
                })
                .then(res => res.json())
                .then(data => resolve({success: true, msg: "Delete successfully!"}))
                .catch(err => reject(err));

        });
    }
}

module.exports = HttpProxy;