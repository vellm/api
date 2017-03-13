'use strict';

const AWS = require('aws-sdk');
const fs = require('fs');

const s3Config = {
  signatureVersion: 'v4',
  region: process.env.AWS_REGION,
  endpoint: new AWS.Endpoint('http://fakes3:4569/'),
  s3ForcePathStyle: true
};

const s3 = new AWS.S3(s3Config);

const bucket = {
  Bucket: process.env.BUCKET_MARKDOWN,
  CreateBucketConfiguration: {
    LocationConstraint: process.env.AWS_REGION,
  },
};

const object = {
  Bucket: process.env.BUCKET_MARKDOWN,
  Key: 'testuser/test.md',
  Body: fs.readFileSync('./fakes3/test.md'),
};

s3.createBucket(bucket).promise()
  .then(() => s3.putObject(object).promise())
  .then(() => console.log('Fake S3 bootstrap completed.'))
  .catch(console.log);
