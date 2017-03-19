'use strict';

const http = require('http');
const querystring = require('querystring');

/** 
 * @param url - instance of `url-parse` (https://github.com/unshiftio/url-parse)
 * @param method - string
*/
function request (url, method) {
    const requestOptions = {
        hostname: url.hostname,
        port: url.port,
        method: method,
        path: url.pathname + '?' + querystring.stringify(url.query),
    };

    return new Promise((resolve) => {
        const req = http.request(requestOptions, resolve);
        req.end();
    });
}

module.exports = request;