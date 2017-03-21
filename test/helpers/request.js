'use strict';

const http = require('http');
const querystring = require('querystring');
const deepAssign = require('deep-assign');

/**
 * @param url - instance of `url-parse` (https://github.com/unshiftio/url-parse)
 * @param requestOptions - options for http.request()
 * @param requestBody - object for request body
*/
function request (url, requestOptions, requestBody) {
    const options = deepAssign({
        hostname: url.hostname,
        port: url.port,
        method: 'GET',
        path: url.pathname + '?' + querystring.stringify(url.query),
    }, requestOptions);

    return new Promise((resolve) => {
        const req = http.request(options, resolve);

        if (requestBody) {
            req.write(JSON.stringify(requestBody));
        }

        req.end();
    });
}

module.exports = request;
