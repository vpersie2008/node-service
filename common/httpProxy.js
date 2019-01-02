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
                    const hostFormat = host.endsWith("/")
                        ? host.substr(0, host.lastIndexOf("/"))
                        : host;

                    const resourceUriFormat = resourcUri.startsWith("/")
                        ? resourcUri.substring(resourcUri.indexOf("/") + 1)
                        : resourcUri;

                    return `${hostFormat}/${resourceUriFormat}`;
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

    _getHttpUrl(resourceName, routePrams = [], requestBody = {}) {
        let resourceRoute = this._getResourceByName(resourceName);

        if (resourceRoute) {
            if (routePrams && Array.isArray(routePrams) && routePrams.length > 0) {
                routePrams.forEach(pram => {
                    resourceRoute = resourceRoute
                        .toLowerCase()
                        .replace(`{${pram.key.toLowerCase()}}`, pram.value.toLowerCase())
                })
            }
        }

        return requestBody && JSON.stringify(requestBody) != "{}"
            ? resourceRoute + "?" + qs.stringify(requestBody)
            : resourceRoute;
    }

    GET(resourceName, routePrams = [], requestBody = {}) {

        const url = this._getHttpUrl(resourceName, routePrams, requestBody);

        return new Promise((resolve, reject) => {
            fetch(url, {
                    method: "GET",
                    headers: this._headersPrams
                })
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

    DELETE(resourceName, routePrams = [], requestBody = {}) {
        const url = this._getHttpUrl(resourceName, routePrams, requestBody);
        return new Promise((resolve, reject) => {
            fetch(url, {
                    method: "DELETE",
                    headers: _headersPrams
                })
                .then(res => res.json())
                .then(data => resolve(data))
                .catch(err => reject(err));
        });
    }
}

module.exports = HttpProxy;