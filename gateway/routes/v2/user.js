module.exports = function ( app, opts, done ) {

    // Get current user UID
    app.get( '/who', ( a_req, a_resp ) => {
        console.log("user who");
        a_resp.send( a_req.uid );
    });

    // List all users
    app.get( '/list', ( a_req, a_resp ) => {
        console.log("user list");
        a_resp.send( a_req.uid );
    });

    done();
}