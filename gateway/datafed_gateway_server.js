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
    logger: false,
    prefix: "v2"
};

if ( config.tls ){
    fastify_opts.https = {
        key: fs.readFileSync( config.web_key ),
        cert: fs.readFileSync( config.web_cert )
    }
}

const app = fastify( fastify_opts );


// ============================================================================
// Setup OpenAPI Schema Validator

validator.init( "datafed_system_api.yaml", {
    framework: 'fastify'
});

//app.register( validator.validate({}) );


// ============================================================================
// Setup Cookie Middleware

const g_cookie_opts = {
    path: '/api',
    secure: true,
    httpOnly: true,
    sameSite: "lax",
    maxAge: 3600
};

app.register( require('fastify-cookie'), {});


// ============================================================================
// Setup CORS Middleware

// Not sure this is right - need to investigate CORS further
app.register( require('fastify-cors'), {
    origin: 'https://sdms.ornl.gov:50200',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true
});

app.decorateRequest( 'uid', '' );

app.addHook('onRequest', ( a_req, a_resp, a_done ) => {
    console.log("onReq",a_req.raw.url);

    if ( a_req.raw.url.startsWith("/api")){
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
        return a_resp.status(400).send( err );
    }

    a_resp.status(500);
    a_resp.send();
});


// ============================================================================
// Anonymous API Methods

app.get( '/version', ( a_req, a_resp ) => {
    a_resp.send( "version" );
});


// Accept UID and password, issue API access and refresh tokens if valid
app.post( '/auth/basic', ( a_req, a_resp ) => {
    console.log("/auth/basic", a_req.body );

    if ( a_req.body.uid == "user" && a_req.body.password == "password" ){
        var token = genAccessToken({ uid: a_req.body.uid });
        //a_resp.setCookie('session', token, g_cookie_opts );
        a_resp.send({ "token" : token });
    }else{
        a_resp.status(401).send("Authorization failed.");
    }
});


// Exchange Globus access token with DataFed scope for API access and refresh tokens
app.post( '/auth/token/exchange', ( a_req, a_resp ) => {
    console.log("/auth/token/exchange", a_req.body );

    var token = a_req.body.token;
    if ( token ){
        introspectToken( token, function( userinfo ){
            var uid = userinfo.username.substr( 0, userinfo.username.indexOf( "@" )),
                token = genAccessToken({ uid: uid });

            //console.log("set cookie",token);
            //a_resp.setCookie('session', token, g_cookie_opts );
            a_resp.send({ "token" : token });
        });
    }else{
        a_resp.status(404).send("BAD");
    }
});

app.post( '/auth/token/refresh', ( a_req, a_resp ) => {
    console.log("/auth/token/refresh", a_req.body );

});

function introspectToken( a_token, a_cb ){
    const opts = {
        hostname: 'auth.globus.org',
        method: 'POST',
        path: '/v2/oauth2/token/introspect',
        rejectUnauthorized: true,
        auth: g_gl_client_id + ":" + g_gl_client_secret,
        headers:{
            'Content-Type' : 'application/x-www-form-urlencoded',
            'Accept' : 'application/json',
        }
    };

    // Request user info from token
    const req = https.request( opts, (res) => {
        var data = '';

        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            var userinfo = JSON.parse( data );

            a_cb( userinfo );
        });
    });

    req.on('error', (e) => {
        console.log("Error, Globus introspection failed:", e );
    });

    req.write( 'token=' + a_token + '&include=identities_set' );
    req.end();
};

function genAccessToken( a_user ) {
    return jwt.sign( a_user, config.token_secret, { expiresIn: config.token_exp });
}



// ============================================================================
// Authenticated API Methods

// Get current user UID
app.get( '/api/user/who', ( a_req, a_resp ) => {
    a_resp.send( a_req.uid );
});

// List all users
app.get( '/api/user/list', ( a_req, a_resp ) => {
    a_resp.send( a_req.uid );
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
