'use strict';

const AWS = require('aws-sdk');
const assert = require('assert');

const s3Config = {
  signatureVersion: 'v4',
  region: process.env.REGION,
};

if (process.env.IS_OFFLINE) {
  s3Config.endpoint = new AWS.Endpoint('http://localhost:8000');
  s3Config.s3ForcePathStyle = true;
}

function validateRequestBody (data) {
    assert(data.body.markdown || data.body.fileName, 'Some keys are missing in request body')

    return data;
}

function s3RequestParams (data) {
    return {
        Bucket: process.env.BUCKET_MARKDOWN,
        Key: data.user.toLowerCase() + '/' + data.body.fileName.toLowerCase(),
        Body: new Buffer(data.body.markdown, 'base64')
    };
}

function handler (event, context, callback) {
    const s3 = new AWS.S3(s3Config);

    return Promise.resolve({ body: event.body, user: event.pathParameters.user })
        .then(validateRequestBody)
        .then(s3RequestParams)
        .then(params => s3.putObject(params).promise())
        .then(() => ({
            statusCode: 200,
            body: JSON.stringify({ message: 'Ok.'})
        }))
        .catch(err => ({
            statusCode: 400,
            body: JSON.stringify({ message: err.message })
        }))
        .then(res => callback(null, res));
}

module.exports = { handler };
