<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">

# Running via Docker

1. Download and install [Docker](https://docs.docker.com/get-docker/)
2. Build an image:
```bash
$ docker build . -t gogoapps/url-collector 
```
3. Start container:
```bash
$ docker run -p 8080:8080 --env-file=.env -d gogoapps/url-collector 
```

**App will run on: http://127.0.0.1/8080**

You may specify 3 environmental variables via ENVs
* ~~PORT (default: `8080`)~~
* CONCURRENT_REQUESTS (default: `5`)
* API_KEY (default: `'DEMO_KEY'`)

Example:
```bash
$ docker run -p 8080:8080 -e CONCURRENT_REQUESTS=2 -e API_KEY=DEMO_KEY -d gogoapps/url-collector 
```

# Running via Node.js Toolchain

## Installation

First, install Node.js on your machine: [How to install Node.js on MacOS](https://nodejs.org/tr/download/package-manager/#macos)

```bash
$ npm install
```

## Running app

```bash
$ npm run start:prod
```

**App will run on: http://127.0.0.1/8080**

## Running tests

Right now there are only e2e endpoint tests. 

_Note NASA APOD API may block your IP address and tests will fail._

```bash
$ npm run test
```

## API Documentation

You may find documentation [here](http://127.0.0.1:8080/doc)
