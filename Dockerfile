FROM mhart/alpine-node:4.5.0

# Install dependencies
RUN apk add --update bash

# Install Yarn
RUN npm i --global yarn serverless mocha

# Copy project and install dependencies
COPY . /app
WORKDIR /app

RUN yarn install