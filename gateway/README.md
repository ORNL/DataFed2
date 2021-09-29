# DataFed API Gateway Server

This is the Fastify based (node.js) DataFed API gateway server. It requires Globus authentication and uses a JWT token passed as either a bearer token, or in a "datafed" cookie. Remote client applications (web services) can access the API by exchanging a users Globus access token for an API access token via the /api/token/exchange method (requires specifying the "datafed:api" scope). The new token can be used to access the API directly.

API schema validation is implemented via OpenAPI 3 and the "openapi-validator-middleware" package. The API is defined in an OpenAPI compliant yaml file (datafed_system_api.yaml).
