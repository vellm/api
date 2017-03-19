'use strict';

const AWS = require('aws-sdk-mock');

const handler = require('../../../src/functions/fetch.js').handler;

describe('Fetch', () => {
    let s3Mock;
    let s3GetObjectResponse;
    let validEvent;
    let invalidEvent;
    let markdownString;

    beforeAll(() => {
        process.env.BUCKET_MARKDOWN = 'test-bucket';

        markdownString = '# Hallo';
        
        s3GetObjectResponse = {
            Body: new Buffer(markdownString),
            LastModified: 10,
            ContentLength: 11,
        }

        validEvent = {
            pathParameters: {
                user: 'TestUsEr',
                vellum: 'teSt',
            },
        };

        invalidEvent = {
            pathParameters: {
                user: 'TestUsEr',
                vellum: 'bla',
            },
        }

        s3Mock = jest.fn((params, cb) => {
            if (params.Key === 'testuser/test.md') {
                return cb(null, s3GetObjectResponse);
            }
            cb(new Error());
        });

        AWS.mock('S3', 'getObject', s3Mock);
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

        it('should return proper body', () => {
            return handler(validEvent, null, (err, res) => {
                const expectedBody = {
                    Markdown: new Buffer(markdownString).toString('base64'),
                    LastModified: 10,
                    ContentLength: 11,
                }
                expect(res).toHaveProperty('body', JSON.stringify(expectedBody));
            });
        });
    });

    describe('Bad request', () => {
        it('should return statusCode 400', () => {
            return handler(invalidEvent, null, (err, res) => {
                expect(res).toHaveProperty('statusCode', 400);
            });
        });
    })
});