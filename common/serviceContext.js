const bizUnitConfig = require("../configuration/bizUnit");

let context = {}
module.exports = {
    setBizUnit: (bizUnit) => {
        context = bizUnit;
    },
    getBizUnit: () => {
        if (!context) {
            return bizUnitConfig;
        }

        return {
            CountryCode: context.CountryCode
                ? context.CountryCode
                : bizUnitConfig.CountryCode,
            CompanyCode: context.CompanyCode
                ? parseInt(context.CompanyCode)
                : bizUnitConfig.CompanyCode,
            LanguageCode: context.LanguageCode
                ? context.LanguageCode
                : bizUnitConfig.LanguageCode,
            RegionCode: context.RegionCode
                ? context.RegionCode
                : bizUnitConfig.RegionCode,
            Authorization: context.Authorization
                ? context.Authorization
                : ""
        }
    }
}
