// ============================================================================
// Anonymous API Methods

var config = require('../../config');
const jwt = require('jsonwebtoken');

module.exports = function ( app, opts, done ) {

    // Get system version number
    app.get( '/version', ( a_req, a_resp ) => {
        a_resp.send( "version" );
    });

    done();
}

