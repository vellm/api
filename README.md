# Vellm API

[![CircleCI](https://circleci.com/gh/vellm/api.svg?style=svg)](https://circleci.com/gh/vellm/api)

## Requirements

* Node v4.3.2 - Why? Because it's the latest version AWS does support
for [Lambda](http://docs.aws.amazon.com/lambda/latest/dg/current-supported-versions.html)

## Usage

The Vellm API is a serverless project created with the [Serverless Framework](http://serverless.com/).

How to use it:

```bash
# Serve the API (available at http://localhost:3000/)
npm run serverless:offline

# Run unit tests
npm run test:unit

# Run integration tests (serverless offline have ro run)
npm run test:integration:offline

# Start serverless offline, run integration tests, teardown serverless
npm run serverless:offline:exec -- 'npm run test:integration:offline'
```