(() => {
  'use strict';
  const assert = require('assert');
  const fetch = require('node-fetch');
  const fs = require('fs');

  describe('Fetch vellum', () => {
    let markdown;

    before(() => {
      markdown = fs.readFileSync('./fakes3/test.md', 'base64');
    });

    it('should return a base64 encoded vellum', () => {
      return fetch('http://api:3000/users/testuser/vellums/test')
        .then((res) => res.json())
        .then((body) => assert.equal(body.Markdown, markdown));
    });
  });
})();
