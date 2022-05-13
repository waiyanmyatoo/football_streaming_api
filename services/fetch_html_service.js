const rs = require("request");

const get_html = function (url, callback) {
     rs(url, function (error, response, html) {
        callback(error, response, html);
    });
}

const get_schedules = function (url) {
    

    rs(baseURL.concat(path.allFootball), (error, response, html) => {
        
    });
}

module.exports = {
    get_html,
    get_schedules,
}