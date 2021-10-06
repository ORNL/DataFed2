module.exports = function ( app, opts, done ) {

    app.get( '/list', ( a_req, a_resp ) => {
        console.log("group list");
        a_resp.send( "group list" );
    });

    app.post( '/create', ( a_req, a_resp ) => {
        console.log("group create");
        a_resp.send( "group create" );
    });

    app.get( '/view', ( a_req, a_resp ) => {
        console.log("group view");
        a_resp.send( "group view" );
    });

    app.post( '/update', ( a_req, a_resp ) => {
        console.log("group update");
        a_resp.send( "group update" );
    });

    app.post( '/delete', ( a_req, a_resp ) => {
        console.log("group delete");
        a_resp.send( "group delete" );
    });

    done();
}