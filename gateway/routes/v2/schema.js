module.exports = function ( app, opts, done ) {

    app.get( '/list', ( a_req, a_resp ) => {
        console.log("schema list");
        a_resp.send( "schema list" );
    });

    app.post( '/find', ( a_req, a_resp ) => {
        console.log("schema find");
        a_resp.send( "schema find" );
    });

    app.post( '/create', ( a_req, a_resp ) => {
        console.log("schema create");
        a_resp.send( "schema create" );
    });

    app.get( '/view', ( a_req, a_resp ) => {
        console.log("schema view");
        a_resp.send( "schema view" );
    });

    app.post( '/update', ( a_req, a_resp ) => {
        console.log("schema update");
        a_resp.send( "schema update" );
    });

    app.post( '/revise', ( a_req, a_resp ) => {
        console.log("schema revise");
        a_resp.send( "schema revise" );
    });

    app.post( '/delete', ( a_req, a_resp ) => {
        console.log("schema delete");
        a_resp.send( "schema delete" );
    });

    done();
}