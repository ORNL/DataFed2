module.exports = function ( app, opts, done ) {

    app.get( '/list', ( a_req, a_resp ) => {
        console.log("project list");
        a_resp.send( "project list" );
    });

    app.post( '/find', ( a_req, a_resp ) => {
        console.log("project find");
        a_resp.send( "project find" );
    });

    app.post( '/create', ( a_req, a_resp ) => {
        console.log("project create");
        a_resp.send( "project create" );
    });

    app.get( '/view', ( a_req, a_resp ) => {
        console.log("project view");
        a_resp.send( "project view" );
    });

    app.post( '/update', ( a_req, a_resp ) => {
        console.log("project update");
        a_resp.send( "project update" );
    });

    app.post( '/update/members', ( a_req, a_resp ) => {
        console.log("project update members");
        a_resp.send( "project update members" );
    });

    app.post( '/update/admins', ( a_req, a_resp ) => {
        console.log("project update members");
        a_resp.send( "project update members" );
    });

    app.post( '/delete', ( a_req, a_resp ) => {
        console.log("project delete");
        a_resp.send( "project delete" );
    });

    done();
}