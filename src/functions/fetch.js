'use strict';

const AWS = require('aws-sdk');

const s3Config = {
  signatureVersion: 'v4',
  region: process.env.REGION,
};

if (process.env.IS_OFFLINE) {
  s3Config.endpoint = new AWS.Endpoint('http://localhost:8000');
  s3Config.s3ForcePathStyle = true;
}

function handler (event, context, callback) {
    const s3 = new AWS.S3(s3Config);
    const params = {
        Bucket: process.env.BUCKET_MARKDOWN,
        Key: event.pathParameters.user.toLowerCase() + '/' + event.pathParameters.vellum.toLowerCase() + '.md'
    };
    return s3.getObject(params).promise()
        .then(res => ({
            statusCode: 200,
            body: JSON.stringify(
                {
                    Markdown: res.Body.toString('base64'),
                    LastModified: res.LastModified,
                    ContentLength: res.ContentLength,
                }
            ),
        }))
        .catch(() => ({
            statusCode: 400,
            body: JSON.stringify({ message: 'Something went wrong.' })
        }))
        .then(res => callback(null, res));
}

module.exports = { handler };