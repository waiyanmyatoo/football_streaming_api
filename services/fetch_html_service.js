const rs = require("request");

const get_html = function (url, callback) {
    rs(url, function (error, response, html) {
        callback(error, response, html);
    });
}



const get_schedules = function (url) {

    var options = {
        'method': 'GET',
        'url': baseURL,
        'headers': {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:99.0) Gecko/20100101 Firefox/99.0'
        }
    };
    rs(options.concat(path.allFootball), (error, response, html) => {

    });
}

module.exports = {
    get_html,
    get_schedules,
}