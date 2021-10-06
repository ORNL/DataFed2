// ============================================================================
// Annotation API Methods

module.exports = function ( app, opts, done ) {

    app.get( '/list', ( a_req, a_resp ) => {
        console.log( "annotate list" );
        a_resp.send( "annotate list" );
    });

    app.post( '/create', ( a_req, a_resp ) => {
        console.log( "annotate create" );
        a_resp.send( "annotate create" );
    });

    app.get( '/view', ( a_req, a_resp ) => {
        console.log( "annotate view" );
        a_resp.send( "annotate view" );
    });

    app.post( '/update', ( a_req, a_resp ) => {
        console.log( "annotate update" );
        a_resp.send( "annotate update" );
    });

    app.post( '/update/state', ( a_req, a_resp ) => {
        console.log( "annotate update state" );
        a_resp.send( "annotate update state" );
    });

    app.post( '/comment', ( a_req, a_resp ) => {
        console.log( "annotate comment" );
        a_resp.send( "annotate comment" );
    });

    app.post( '/comment/edit', ( a_req, a_resp ) => {
        console.log( "annotate comment edit" );
        a_resp.send( "annotate comment edit" );
    });

    done();
}

