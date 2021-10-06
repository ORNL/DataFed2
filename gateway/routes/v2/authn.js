// ============================================================================
// Anonymous API Methods

var config = require('../../config');
const jwt = require('jsonwebtoken');

module.exports = function ( app, opts, done ) {

    // Accept UID and password, issue API access and refresh tokens if valid
    app.post( '/basic', ( a_req, a_resp ) => {
        console.log("/authn/basic", a_req.body );

        if ( a_req.body.uid == "user" && a_req.body.password == "password" ){
            var token = genAccessToken({ uid: a_req.body.uid });
            if ( a_req.query.session_cookie ){
                a_resp.setCookie('session', token, config.sess_cookie_opts );
            }
            a_resp.send({ "token" : token });
        }else{
            a_resp.status(401).send("Authorization failed - invalid UID or password.");
        }
    });


    // Exchange Globus access token with DataFed scope for API access and refresh tokens
    app.post( '/token/exchange', ( a_req, a_resp ) => {
        console.log("/authn/token/exchange", a_req.body );

        var token = a_req.body.token;
        if ( token ){
            introspectToken( token, function( userinfo ){
                var uid = userinfo.username.substr( 0, userinfo.username.indexOf( "@" )),
                    token = genAccessToken({ uid: uid });

                //console.log("set cookie",token);
                if ( a_req.query.session_cookie ){
                    a_resp.setCookie('session', token, config.sess_cookie_opts );
                }
                a_resp.send({ "token" : token });
            });
        }else{
            a_resp.status(404).send("BAD");
        }
    });

    app.post( '/token/refresh', ( a_req, a_resp ) => {
        console.log("/authn/token/refresh", a_req.body );

    });

    done();
}

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
