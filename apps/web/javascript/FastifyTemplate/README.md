# FastifyTemplate

Template for Node.js [Fastify](https://www.fastify.io/) web service providing
API via OpenAPI

## Overview

The web server uses fastify as an alternative to express. It was chosen because
it can be used to automatically generate the api and schema validation from a
single point of truth which takes the form of a file shown in this directory
and called api_spec.yaml. 

## Running the web server

To test and run the web server you can use the scripts in the datafed2/scripts
folder to generate self signed certificates and a web token.

Will create self signed certificate keys

```bash
$ create_self_signed_cert.sh
```

Will source environment variables

```bash
$ source setup_test_env.sh
```

Running the web server.

```bash
$ node server.js
```
