const log4js = require("log4js");
log4js.configure({
    appenders: {
        console: {
            type: "console"
        },
        info_file: {
            type: "dateFile",
            filename: __dirname + `/../logs/info`,
            alwaysIncludePattern: true,
            daysToKeep: 10,
            pattern: "-yyyy-MM-dd.log",
            encoding: "utf-8"
        },
        error_file: {
            type: "dateFile",
            filename: __dirname + `/../logs/error`,
            alwaysIncludePattern: true,
            daysToKeep: 10,
            pattern: "-yyyy-MM-dd.log",
            encoding: "utf-8"
        }
    },
    categories: {
        default: {
            appenders: ["console"],
            level: 'info'
        },
        info_log: {
            appenders: ["info_file","console"],
            level: "info"
        },
        error_log: {
            appenders: ["error_file","console"],
            level: "warn"
        }
    }
});

const infoLog = log4js.getLogger("info_log");
const errorLog = log4js.getLogger("error_log");

module.exports.info = (msg) => {
    infoLog.info(msg);
}

module.exports.error = (msg) => {
    errorLog.error(msg)
}

module.exports.warning = (msg)=>{
    errorLog.warn(msg)
}
