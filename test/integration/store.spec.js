'use strict';

const URL = require('url-parse');
const util = require('util');

const request = require('../helpers/request.js');
const getS3Object = require('../helpers/getS3Object.js');

describe('Store', () => {
    let url;
    let markdownString;
    let markdownStringEncoded;
    let requestOptions;
    let user;

    beforeEach(() => {
        user = 'testuser';
        url = new URL(process.env.API_ENDPOINT + '/users/testuser/vellums');
        markdownString = '# Hallo';
        markdownStringEncoded = new Buffer(markdownString).toString('base64');
        requestOptions = {
            method: 'POST'
        }
    });

    describe('200', () => {
        it('when valid request taken', () => {
            const requestBody = {
                markdown: markdownStringEncoded,
                fileName: util.format('test-%s.md', Date.now())
            }

            return request(url, requestOptions, requestBody)
                .then((res) => {
                    expect(res.statusCode).toEqual(200);
                })
                .then(() => getS3Object(user, requestBody.fileName))
                .then((res) => expect(res).toBeDefined());
        });
    });

    describe('400', () => {
        it('when invalid request body given', () => {
            const requestBody = {
                markdown: markdownStringEncoded,
            }

            return request(url, requestOptions, requestBody)
                .then((res) => {
                    expect(res.statusCode).toEqual(400);
                });
        });
    });
});
