module.exports = function ( app, opts, done ) {

    app.get( '/ep/recent/list', ( a_req, a_resp ) => {
        console.log("globus ep recent list");
        a_resp.send( "globus ep recent list" );
    });

    app.get( '/ep/favorite/list', ( a_req, a_resp ) => {
        console.log("globus ep favorite list");
        a_resp.send( "globus ep favorite list" );
    });

    app.post( '/ep/favorite/add', ( a_req, a_resp ) => {
        console.log("globus ep favorite add");
        a_resp.send( "globus ep favorite add" );
    });

    app.post( '/ep/favorite/remove', ( a_req, a_resp ) => {
        console.log("globus ep favorite remove");
        a_resp.send( "globus ep favorite remove" );
    });

    app.get( '/authz/verify', ( a_req, a_resp ) => {
        console.log("globus authz verify");
        a_resp.send( "globus ep authz verify" );
    });

    done();
}