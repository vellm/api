# Vellm API

## Requirements

* Node v4.3.2 - Why? Because it's the latest version AWS does support
for [Lambda](http://docs.aws.amazon.com/lambda/latest/dg/current-supported-versions.html)
* Docker

## Usage

The Vellm API is a serverless project created with the [Serverless Framework](http://serverless.com/). For me it was very important to
have a really good local setup to work on the project, run tests etc. without
the latency to deploy the stack every time. That's the reason why I'am using
the offline plugin for serverless in combination with fakes3.

How to use it:

```bash
# Serve the fakes3 instance
make fakes3-run

# Serve the API
make api-run
```

That's it! Now the API is available at: http://localhost:3000/
The Makefile provides additional tasks, you can get an overview with `make help`.
