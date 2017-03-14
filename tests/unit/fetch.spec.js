'use strict';

const AWS = require('aws-sdk-mock');
const handler = require('../../functions/fetch').handler;

describe('fetch', () => {
    let s3GetObjectMock;
    let s3GetObjectResponse;
    let event;
    let callbackSpy;
    let expectedKey;

    beforeAll(() => {
        process.env.BUCKET_MARKDOWN = 'test-bucket';
        callbackSpy = jest.fn();
        s3GetObjectResponse = {
            Body: 'test',
            LastModified: 10,
            ContentLength: 10,
        }
        event = {
            path: {
                user: 'TestUsEr',
                vellum: 'teSt',
            }
        }
        expectedKey = 'testuser/test.md'
        s3GetObjectMock = jest.fn((params, cb) => cb(null, s3GetObjectResponse));
        AWS.mock('S3', 'getObject', s3GetObjectMock);
    });

    afterEach(() => {
        callbackSpy.mockClear();
        s3GetObjectMock.mockClear();
    });

    afterAll(() => {
        AWS.restore('S3');
    });

    it('should response with proper values', () => {
        return handler(event, null, callbackSpy).then(() => {
            const callbackFirstCall = callbackSpy.mock.calls[0];
            const callbackResponse = callbackFirstCall[1];

            expect(callbackResponse).toHaveProperty('Markdown');
            expect(callbackResponse).toHaveProperty('LastModified');
            expect(callbackResponse).toHaveProperty('ContentLength');
        });
    });

    describe('Query Params', () => {
        it('should contain `Bucket`', () => {
            return handler(event, null, callbackSpy).then(() => {
                const s3QueryCall = s3GetObjectMock.mock.calls[0];
                const queryParams = s3QueryCall[0];
                
                expect(queryParams).toHaveProperty('Bucket', process.env.BUCKET_MARKDOWN);
            });
        });

        it('should contain `Key`', () => {
            return handler(event, null, callbackSpy).then(() => {
                const s3QueryCall = s3GetObjectMock.mock.calls[0];
                const queryParams = s3QueryCall[0];
                
                expect(queryParams).toHaveProperty('Key', expectedKey);
            });
        });
    });
});
