'use strict';

const AWS = require('aws-sdk');
const util = require('util');

const s3Config = {
  signatureVersion: 'v4',
  region: process.env.REGION,
};

if (process.env.IS_OFFLINE) {
  s3Config.endpoint = new AWS.Endpoint('http://localhost:8000');
  s3Config.s3ForcePathStyle = true;
}

function getS3Object (user, fileName) {
    const s3 = new AWS.S3(s3Config);

    const params = {
        Bucket: process.env.BUCKET_MARKDOWN,
        Key: util.format('%s/%s', user, fileName)
    };
    return s3.getObject(params).promise()
}

module.exports = getS3Object;
