'use strict';

const apiVal = require('openapi-validator-middleware');
const fs = require('fs');
const path = require('path');
const https = require('https');
const jwt = require('jsonwebtoken');
const oauth2_client = require('client-oauth2');
const fastify = require('fastify');
const g_gl_client_id = "19e7a1e1-762b-4d56-8c41-cbef90afb82f";
const g_gl_client_secret = "cIj5qu5q2HYV9yl2cGFdZPbLKUGAuDfYh05BzZAMGow=";
const g_globus_auth = new oauth2_client({
    clientId: g_gl_client_id,
    clientSecret: g_gl_client_secret,
    authorizationUri: 'https://auth.globus.org/v2/oauth2/authorize',
    accessTokenUri: 'https://auth.globus.org/v2/oauth2/token',
    redirectUri: "https://sdms.ornl.gov:50100/app/ui/auth",
    scopes: 'urn:globus:auth:scope:transfer.api.globus.org:all offline_access openid'
});
const g_cookie_opts = {
    path: '/auth',
    secure: true,
    httpOnly: true,
    sameSite: "lax",
    maxAge: 3600
};
const g_tok_secret = "Xh6-7puYwW-08TyF+67Sfd";
const g_tok_exp = '3600s';



apiVal.init('testapi.yml', {
    framework: 'fastify'
});

const app = fastify({
    logger: true,
    https: {
        key: fs.readFileSync( "/opt/datafed/keys/sdms.ornl.gov.key" ),
        cert: fs.readFileSync( "/opt/datafed/keys/sdms.ornl.gov.crt" )
    }
});

app.register( require('fastify-static'), {
    root: path.join( __dirname, 'static')
});

app.register( require('point-of-view'), {
    engine: {
        ejs: require('ejs')
    }
});

app.register( apiVal.validate({}) );


app.register( require('fastify-cookie'), {
    secret: "my-secret-12345", // for cookies signature
    parseOptions: {}
});


//Access-Control-Allow-Credentials

app.register( require('fastify-cors'), {
    origin: 'https://sdms.ornl.gov:50200',
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true
});

app.decorateRequest( 'uid', '' );

app.addHook('onRequest', ( a_req, a_resp, a_done ) => {
    //console.log("hook url",req.raw.url);

    if ( a_req.raw.url.startsWith("/auth")){
        console.log( "authenticate user" );

        if ( a_req.cookies.session ){
            //console.log("session jwt:",token);

            jwt.verify( a_req.cookies.session, g_tok_secret, ( err, user ) => {
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
                jwt.verify( token, g_tok_secret, ( err, user ) => {
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


app.setErrorHandler( async ( err, req, reply ) => {
    //console.log("ERROR",err);

    if ( err instanceof apiVal.InputValidationError ){
        return reply.status(400).send( err );
    }

    reply.status(500);
    reply.send();
});

// ========================================== UI Methods

app.get('/', ( a_req, a_rep ) => {
    console.log( "/", a_req.socket.remoteAddress );

    a_rep.redirect( '/app/ui/welcome' );
});

app.get('/app/ui/welcome', ( a_req, a_rep ) => {
    console.log( "/app/ui/welcome", a_req.socket.remoteAddress );

    a_rep.view('/views/welcome.ejs', { theme: "light" })
});

app.get( '/app/ui/login', (a_req, a_resp) => {
    console.log( "/app/ui/login", a_req.socket.remoteAddress );

    a_resp.redirect( g_globus_auth.code.getUri() );
});


// Redirect endpoint from Globus OAuth login

app.get( '/app/ui/auth', ( a_req, a_resp ) => {
    console.log( "/app/ui/auth", a_req.socket.remoteAddress );

    // Ask Globus for client token (Globus knows user somehow - cookies?)
    g_globus_auth.code.getToken( a_req.raw.url ).then( function( client_token ) {
        var xfr_token = client_token.data.other_tokens[0];

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
                if ( res.statusCode >= 200 && res.statusCode < 300 ){
                    var userinfo = JSON.parse( data ),
                        uid = userinfo.username.substr( 0, userinfo.username.indexOf( "@" ));

                    console.log( "User", uid, "authenticated" );

                    const user = {
                        uid: uid
                    };

                    /* other stuff to save to DB
                        userinfo.name;
                        xfr_token.access_token;
                        xfr_token.expires_in;
                        xfr_token.refresh_token;
                    */

                    const jwt_token = genAccessToken( user );
                    //console.log( "token", jwt_token );
                    a_resp.setCookie('session', jwt_token, g_cookie_opts );
                    //console.log( "redirecting" );
                    a_resp.redirect( "/auth/app/ui/main" );
                }else{
                    console.log("Error: Globus introspection failed. User token:", xfr_token );
                    a_resp.redirect( "/app/ui/error" );
                }
            });
        });

        req.on('error', (e) => {
            console.log("Error: Globus introspection failed. User token:", xfr_token );
            a_resp.redirect( "/app/ui/error" );
        });

        req.write( 'token=' + client_token.accessToken + '&include=identities_set' );
        req.end();
    }, function( reason ){
        console.log("Error: Globus get token failed. Reason:", reason );
        a_resp.redirect( "/app/ui/error" );
    });
});


app.get( '/auth/app/ui/main', ( a_req, a_resp ) => {
    console.log( "/auth/app/ui/main", a_req.socket.remoteAddress );

    a_resp.view('/views/main.ejs', { theme: "light", uid: a_req.uid })
});

app.get( '/auth/app/ui/logout', (a_req, a_resp) => {
    console.log( "/auth/app/ui/logout", a_req.socket.remoteAddress );

    if ( a_req.cookies.session ){
        console.log( "clear cookie" );

        a_resp.clearCookie('session', g_cookie_opts );

        console.log( "redirect" );

        a_resp.redirect("https://auth.globus.org/v2/web/logout?redirect_name=Test Server&redirect_uri=https://sdms.ornl.gov:50100");
    }else{
        a_resp.status(406).send({
            message: 'No active session.'
        });
    }
});

app.get( '/auth/app/api/token', (a_req, a_resp) => {
    console.log( "/auth/app/api/token", a_req.socket.remoteAddress );

    if ( a_req.cookies.session ){
        a_resp.send( a_req.cookies.session );
    }else{
        a_resp.status(406).send({
            message: 'No active session.'
        });
    }
});

// =================================================== API Authorization Server Endpoints

app.post( '/api/token', ( a_req, a_resp ) => {
    console.log("/api/token", a_req.body );

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
    return jwt.sign( a_user, g_tok_secret, { expiresIn: g_tok_exp });
}

// ========================================== API Methods

app.get( '/auth/api/user/list', ( a_req, a_resp ) => {
    a_resp.send( a_req.uid );
});

app.get( '/auth/api/user/who', ( a_req, a_resp ) => {
    a_resp.send( a_req.uid );
});

app.get( '/auth/api/something', ( a_req, a_resp ) => {
    a_resp.send( "something as text 123456789012345678901234567890" );
});


console.log( "Starting https server" );

app.listen( 50100, "sdms.ornl.gov", function( err, address ){
    if ( err ){
        console.log( err );
        process.exit( 1 );
    }

    console.log( "server listening on:", address );
});
