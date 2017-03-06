.DEFAULT_GOAL := help

NODE_ENV ?= development
REQUIRED_NODE_VERSION = v4.5.0
STAGE ?= v1

BUCKET_MARKDOWN = markdown-bucket
FAKES3_PORT = 4567
FAKES3_ROOT = $(shell pwd)/.fakes3/
FAKES3_TEST_INSTANCE = $(shell pwd)/development/
API_ENDPOINT = http://localhost:3000

# Export environment variables for serverless
export BUCKET_MARKDOWN
export STAGE
export NODE_ENV
export FAKES3_PORT
export API_ENDPOINT

fakes3-bootstrap: ## Create fakes3 instance for local development
	@mkdir -p $(FAKES3_ROOT)
	@mkdir -p $(FAKES3_ROOT)$(BUCKET_MARKDOWN)
	@cp -r $(FAKES3_TEST_INSTANCE)** $(FAKES3_ROOT)$(BUCKET_MARKDOWN)

fakes3-reset: ## Reset fakes3 instance
	@rm -rf $(FAKES3_ROOT)
	@make fakes3-bootstrap

fakes3-run: fakes3-bootstrap ## Fire up fakes3 service
	docker run \
		-v $(FAKES3_ROOT):/fakes3_root \
		-p $(FAKES3_PORT):4569 \
		lphoward/fake-s3

tests-dev:
	$(shell npm bin)/mocha

api-serve: node-version-check ## Serve local instance of API
	$(shell npm bin)/serverless offline

api-deploy: NODE_ENV = production
api-deploy: node-version-check ## Deploy API to AWS
	$(shell npm bin)/serverless deploy

node-version-check:
	@test $(shell node --version) = $(REQUIRED_NODE_VERSION) || \
		{ echo "Node version $(shell node --version) is installed, but v4.5.0 is required!" ; exit 1 ; }

help:
	@grep -E '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-12s\033[0m %s\n", $$1, $$2}'
