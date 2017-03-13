.DEFAULT_GOAL := help

NODE_ENV ?= development
STAGE ?= v1

BUCKET_MARKDOWN = markdown-bucket
FAKES3_PORT = 4567
API_ENDPOINT = http://localhost:3000
HOSTNAME ?= localhost

# Export environment variables for serverless
export BUCKET_MARKDOWN
export STAGE
export NODE_ENV
export FAKES3_PORT
export API_ENDPOINT

fakes3boostrap:
	docker-compose up fakes3boostrap

tests-dev:
	docker-compose run test mocha tests/integration --timeout 5000

tests-ci: fakes3boostrap
	docker-compose up --build test
	exit $(shell docker wait api_test_1)

api-serve: ## Serve local instance of API
	docker-compose up --build api

api-deploy: NODE_ENV = production
api-deploy: ## Deploy API to AWS
	docker-compose run api serverless deploy

help:
	@grep -E '^[a-zA-Z0-9_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-12s\033[0m %s\n", $$1, $$2}'
