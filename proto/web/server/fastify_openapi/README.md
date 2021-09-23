# Prototype Web Server / API Gateway

This is test / evaluation code for a Fastify based (node.js) combined app server and API gateway. It supports Globus authentication and sets a JWT via session cookie for the web application. API authentication supports both cookie and bearer token methods (both using the same JWT). Remote client applications (web services) can access the API by exchanging a users Globus access token for an API access token via the /api/token method (requires specifying a custom scope). The new token can be used to access the API directly (as a bearer token).

API schema validation is implemented via OpenAPI 3 and the "openapi-validator-middleware" package. The API is defined in an OpenAPI compliant yaml file (testapi.yml).
