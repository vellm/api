'use strict';

const AWS = require('aws-sdk');

class s3ExampleContentPlugin {
    constructor(serverless) {
        this.serverless = serverless;
        this.createHandler = this.createHandler.bind(this);

        this.commands = {
            s3ExampleContent: {
                usage: 'Create example content for s3 bucket',
                lifecycleEvents: [
                    'create',
                ],
            },
        };

        this.hooks = {
            's3ExampleContent:create': this.createHandler.bind(this),
            'after:s3:start:startHandler': () => this.serverless.pluginManager.run(['s3ExampleContent']),
        };
    }

    createHandler() {
        this.serverless.cli.log('Creating example content for s3 bucket...');
        
        const config = (this.serverless.service.custom && this.serverless.service.custom.s3) || {};
        
        const s3 = new AWS.S3({
          s3ForcePathStyle: true,
          endpoint: new AWS.Endpoint(`http://localhost:${config.port}`),
        });

        const object = {
            Bucket: config.buckets[0],
            Key: 'testuser/test.md',
            Body: new Buffer('# Test'),
        };

        return s3.putObject(object).promise();
    }
}

module.exports = s3ExampleContentPlugin;