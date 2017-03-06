(() => {
  'use strict';
  const AWS = require('aws-sdk');
  const assert = require('assert');
  const fetch = require('node-fetch');
  const fs = require('fs');

  describe('GET vellums', () => {
    let s3;
    let markdown;

    before(() => {
      s3 = new AWS.S3({
        signatureVersion: 'v4',
        region: process.env.AWS_REGION,
        endpoint: new AWS.Endpoint('http://localhost:' + process.env.FAKES3_PORT),
        s3ForcePathStyle: true,
      });
      markdown = fs.readFileSync('./development/testuser/test.md/.fakes3_metadataFFF/content', 'base64');
    });

    it('should return a base64 encoded vellum', () => {
      return fetch(process.env.API_ENDPOINT + '/users/testuser/vellums/test')
        .then((res) => res.json())
        .then((body) => assert.equal(body.Markdown, markdown));
    });
  });
})();
