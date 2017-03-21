'use strict';

const AWS = require('aws-sdk-mock');

const handler = require('../../../src/functions/store.js').handler;

describe('Store', () => {
    let s3Mock;
    let s3PutObjectResponse;
    let validEvent;
    let markdownString;
    let markdownStringEncoded;

    beforeAll(() => {
        process.env.BUCKET_MARKDOWN = 'test-bucket';

        markdownString = '# Hallo';
        markdownStringEncoded = new Buffer(markdownString).toString('base64');

        s3PutObjectResponse = {
            Expiration: new Date(),
        }

        validEvent = {
            pathParameters: {
                user: 'TestUsEr',
            },
            body: JSON.stringify({
                markdown: markdownStringEncoded,
                fileName: 'test.md'
            })
        };

        s3Mock = jest.fn((params, cb) => cb(null, s3PutObjectResponse));

        AWS.mock('S3', 'putObject', s3Mock);
    });

    afterEach(() => {
        s3Mock.mockClear();
    });

    afterAll(() => {
        delete process.env.BUCKET_MARKDOWN;

        AWS.restore('S3');
    });

    describe('Successful request', () => {
        it('should return statusCode 200', () => {
            return handler(validEvent, null, (err, res) => {
                expect(res).toHaveProperty('statusCode', 200);
            });
        });

        it('should call aws sdk', () => {
            return handler(validEvent, null, (err, res) => {
                expect(s3Mock).toHaveBeenCalled();
            });
        });
    });

    describe('Bad request', () => {
        it('when fileName is missing in request body', () => {
            const invalidEvent = {
                pathParameters: {
                    user: 'TestUsEr',
                },
                body: JSON.stringify({
                    markdown: markdownStringEncoded
                })
            };

            return handler(invalidEvent, null, (err, res) => {
                expect(res).toHaveProperty('statusCode', 400);
            });
        });

        it('when markdown is missing in request body', () => {
            const invalidEvent = {
                pathParameters: {
                    user: 'TestUsEr',
                },
                body: JSON.stringify({
                    fileName: 'test.md'
                })
            };

            return handler(invalidEvent, null, (err, res) => {
                expect(res).toHaveProperty('statusCode', 400);
            });
        });
    })
});
