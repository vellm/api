'use strict';

const URL = require('url-parse');

const request = require('../helpers/request.js');

describe('Fetch', () => {
    let url;

    beforeEach(() => {
        url = new URL(process.env.API_ENDPOINT + '/users/testuser/vellums/test');
    });

    describe('200', () => {
        it('when valid request taken', () => {
            return request(url, 'GET').then((res) => {
                expect(res.statusCode).toEqual(200);
            });
        });
    });
});