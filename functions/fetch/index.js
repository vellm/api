'use strict';

const AWS = require('aws-sdk');

const s3Config = {
  signatureVersion: 'v4',
  region: process.env.AWS_REGION,
};

if (process.env.NODE_ENV === 'development') {
  s3Config.endpoint = new AWS.Endpoint('http://fakes3:4569/');
  s3Config.s3ForcePathStyle = true;
}

const s3 = new AWS.S3(s3Config);

module.exports.handler = (event, context, callback) => {
  const params = {
    Bucket: process.env.BUCKET_MARKDOWN,
    Key: event.path.user.toLowerCase() + '/' + event.path.vellum.toLowerCase() + '.md'
  };
  s3.getObject(params).promise()
    .then(res => callback(null, {
      Markdown: res.Body.toString('base64'),
      LastModified: res.LastModified,
      ContentLength: res.ContentLength,
    }))
    .catch(err => {
      callback(new Error('[400] ' + err));
    });
};
