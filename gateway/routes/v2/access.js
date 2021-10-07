module.exports = function ( app, opts, done ) {

    app.get( '/permissions/verify', ( a_req, a_resp ) => {
        console.log("access perms verify");
        a_resp.send( "access perms verify" );
    });

    app.get( '/permissions/get', ( a_req, a_resp ) => {
        console.log("access perms get");
        a_resp.send( "access perms get" );
    });

    app.get( '/rules/view', ( a_req, a_resp ) => {
        console.log("access rules view");
        a_resp.send( "access rules view" );
    });

    app.post( '/rules/set', ( a_req, a_resp ) => {
        console.log("access rules set");
        a_resp.send( "access rules set" );
    });

    app.post( '/rules/add', ( a_req, a_resp ) => {
        console.log("access rules add");
        a_resp.send( "access rules add" );
    });

    app.post( '/rules/remove', ( a_req, a_resp ) => {
        console.log("access rules remove");
        a_resp.send( "access rules remove" );
    });

    done();
}
