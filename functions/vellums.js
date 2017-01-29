'use strict';

const AWS = require('aws-sdk');
const s3 = new AWS.S3();

module.exports.get = (event, context, callback) => {
  var params = {
    Bucket: process.env.BUCKET,
    Key: event.path.user.toLowerCase() + '/' + event.path.vellum.toLowerCase() + '.md',
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
