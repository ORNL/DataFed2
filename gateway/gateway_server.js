'use strict';

var config = require('./config');

const validator = require('openapi-validator-middleware');
const fs = require('fs');
const path = require('path');
const https = require('https');
const jwt = require('jsonwebtoken');
const fastify = require('fastify');


// ============================================================================
// Setup Fasity Application

var fastify_opts = {
    logger: true
};

if ( config.tls ){
    fastify_opts.https = {
        key: fs.readFileSync( config.web_key ),
        cert: fs.readFileSync( config.web_cert )
    }
}

const app = fastify( fastify_opts );

app.register( require('./routes/v2/general'), { prefix: '/v2' });
app.register( require('./routes/v2/authn'), { prefix: '/v2/authn' });
app.register( require('./routes/v2/user'), { prefix: '/v2/api/user' });
app.register( require('./routes/v2/group'), { prefix: '/v2/api/group' });
app.register( require('./routes/v2/project'), { prefix: '/v2/api/project' });
app.register( require('./routes/v2/record'), { prefix: '/v2/api/record' });
app.register( require('./routes/v2/folder'), { prefix: '/v2/api/folder' });
app.register( require('./routes/v2/access'), { prefix: '/v2/api/access' });
app.register( require('./routes/v2/shares'), { prefix: '/v2/api/shares' });
app.register( require('./routes/v2/annotate'), { prefix: '/v2/api/annotate' });
app.register( require('./routes/v2/schema'), { prefix: '/v2/api/schema' });
app.register( require('./routes/v2/catalog'), { prefix: '/v2/api/catalog' });
app.register( require('./routes/v2/search'), { prefix: '/v2/api/search' });
app.register( require('./routes/v2/repo'), { prefix: '/v2/api/repo' });
app.register( require('./routes/v2/alloc'), { prefix: '/v2/api/alloc' });
app.register( require('./routes/v2/task'), { prefix: '/v2/api/task' });
app.register( require('./routes/v2/globus'), { prefix: '/v2/api/globus' });


// ============================================================================
// Setup OpenAPI Schema Validator

validator.init( "./openapi/v2/system_api.yaml", {
    framework: 'fastify'
});

app.register( validator.validate({}) );


// ============================================================================
// Setup Cookie Middleware

app.register( require('fastify-cookie'), {});


// ============================================================================
// Setup Swagger UI

// TODO Need to customize / theme swagger UI
// TODO Maybe should just user swagger-ui directly? Not sure what fastify-swagger provides beyond swagger-ui

app.register( require('fastify-swagger'), {
    mode: "static",
    routePrefix: "/docs",
    exposeRoute: true,
    uiConfig: {
        docExpansion: "list",
        deepLinking: false,
        tryItOutEnabled: true,
        filter: true
    },
    specification: {
        path: "./openapi/v2/system_api.yaml",
    }
});

// ============================================================================
// Setup CORS Middleware

// Not sure this is right - need to investigate CORS further
/*
app.register( require('fastify-cors'), {
    origin: 'https://sdms.ornl.gov:50200',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true
});
*/

app.decorateRequest( 'uid', '' );

app.addHook('onRequest', ( a_req, a_resp, a_done ) => {
    //console.log("onReq",a_req.raw.url);

    if ( a_req.raw.url.startsWith("/v2/api")){
        console.log( "authenticate user" );

        if ( a_req.cookies.session ){
            //console.log("session jwt:",token);

            jwt.verify( a_req.cookies.session, config.token_secret, ( err, user ) => {
                if ( err ){
                    return a_resp.status(403).send({ message: "Invalid / expired access token" });
                }

                a_req.uid = user.uid;
                a_done();
            });
        }else{
            const authHeader = a_req.headers['authorization']
            const token = authHeader && authHeader.split(' ')[1]

            if ( token ){
                jwt.verify( token, config.token_secret, ( err, user ) => {
                    if ( err ){
                        return a_resp.status(403).send({ message: "Invalid / expired access token" });
                    }

                    a_req.uid = user.uid;
                    a_done();
                });
            }else{
                console.log( "not authenticated" );

                a_resp.status(401).send({ message: "Not Authenticated" });
            }
        }
    }else{
        a_done();
    }
});


app.setErrorHandler( async ( err, a_req, a_resp ) => {
    console.log("ERROR",err);

    if ( err instanceof validator.InputValidationError ){
        //console.log("Details:",JSON.stringify(err.errors));
        return a_resp.status(400).send({ message: "Input validation error", errors: err.errors });
    }

    a_resp.status(500);
    a_resp.send();
});


// ============================================================================
// Server Start-up

console.log( "Starting DataFed gateway server" );

app.listen( config.port, config.host, function( err, address ){
    if ( err ){
        console.log( err );
        process.exit( 1 );
    }

    console.log( "DataFed gateway server listening on:", address );
});