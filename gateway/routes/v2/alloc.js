module.exports = function ( app, opts, done ) {

    app.get( '/list', ( a_req, a_resp ) => {
        console.log("alloc list");
        a_resp.send( "alloc list" );
    });

    app.get( '/view', ( a_req, a_resp ) => {
        console.log("alloc view");
        a_resp.send( "alloc view" );
    });

    app.post( '/create', ( a_req, a_resp ) => {
        console.log("alloc create");
        a_resp.send( "alloc create" );
    });

    app.post( '/update', ( a_req, a_resp ) => {
        console.log("alloc update");
        a_resp.send( "alloc update" );
    });

    app.post( '/delete', ( a_req, a_resp ) => {
        console.log("alloc delete");
        a_resp.send( "alloc delete" );
    });

    app.get( '/default/get', ( a_req, a_resp ) => {
        console.log("alloc def get");
        a_resp.send( "alloc def get" );
    });

    app.post( '/default/set', ( a_req, a_resp ) => {
        console.log("alloc def set");
        a_resp.send( "alloc def set" );
    });

    app.get( '/records/list', ( a_req, a_resp ) => {
        console.log("alloc rec list");
        a_resp.send( "alloc rec list" );
    });

    app.get( '/statistics', ( a_req, a_resp ) => {
        console.log("alloc stats");
        a_resp.send( "alloc stats" );
    });

    done();
}
