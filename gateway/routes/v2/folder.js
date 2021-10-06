module.exports = function ( app, opts, done ) {

    app.post( '/create', ( a_req, a_resp ) => {
        console.log("folder create");
        a_resp.send( "folder create" );
    });

    app.get( '/view', ( a_req, a_resp ) => {
        console.log("folder view");
        a_resp.send( "folder view" );
    });

    app.post( '/update', ( a_req, a_resp ) => {
        console.log("folder update");
        a_resp.send( "folder update" );
    });

    app.post( '/delete', ( a_req, a_resp ) => {
        console.log("folder delete");
        a_resp.send( "folder delete" );
    });

    app.get( '/items/list', ( a_req, a_resp ) => {
        console.log("folder items list");
        a_resp.send( "folder items list" );
    });

    app.post( '/items/link', ( a_req, a_resp ) => {
        console.log("folder items link");
        a_resp.send( "folder items link" );
    });

    app.post( '/items/unlink', ( a_req, a_resp ) => {
        console.log("folder items unlink");
        a_resp.send( "folder items unlink" );
    });

    app.post( '/items/move', ( a_req, a_resp ) => {
        console.log("folder items move");
        a_resp.send( "folder items move" );
    });

    app.post( '/items/lock', ( a_req, a_resp ) => {
        console.log("folder items lock");
        a_resp.send( "folder items lock" );
    });

    app.post( '/items/unlock', ( a_req, a_resp ) => {
        console.log("folder items unlock");
        a_resp.send( "folder items unlock" );
    });

    done();
}