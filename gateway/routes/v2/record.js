module.exports = function ( app, opts, done ) {

    app.post( '/create', ( a_req, a_resp ) => {
        console.log("record create");
        a_resp.send( "record create" );
    });

    app.get( '/view', ( a_req, a_resp ) => {
        console.log("record view");
        a_resp.send( "record view" );
    });

    app.post( '/update', ( a_req, a_resp ) => {
        console.log("record update");
        a_resp.send( "record update" );
    });

    app.post( '/update/allocation', ( a_req, a_resp ) => {
        console.log("record update allocation");
        a_resp.send( "record update allocation" );
    });

    app.post( '/update/owner', ( a_req, a_resp ) => {
        console.log("record update owner");
        a_resp.send( "record update owner" );
    });

    app.post( '/delete', ( a_req, a_resp ) => {
        console.log("record delete");
        a_resp.send( "record delete" );
    });

    app.post( '/lock', ( a_req, a_resp ) => {
        console.log("record lock");
        a_resp.send( "record lock" );
    });

    app.post( '/unlock', ( a_req, a_resp ) => {
        console.log("record unlock");
        a_resp.send( "record unlock" );
    });

    app.post( '/import', ( a_req, a_resp ) => {
        console.log("record import");
        a_resp.send( "record import" );
    });

    app.get( '/export', ( a_req, a_resp ) => {
        console.log("record export");
        a_resp.send( "record export" );
    });

    app.get( '/provenance/graph', ( a_req, a_resp ) => {
        console.log("record prov graph");
        a_resp.send( "record prov graph" );
    });

    app.post( '/metadata/validate', ( a_req, a_resp ) => {
        console.log("record metadata validate");
        a_resp.send( "record metadata validate" );
    });

    app.get( '/data/download', ( a_req, a_resp ) => {
        console.log("record data download");
        a_resp.send( "record data download" );
    });

    app.post( '/data/upload', ( a_req, a_resp ) => {
        console.log("record data upload");
        a_resp.send( "record data upload" );
    });

    app.post( '/data/delete', ( a_req, a_resp ) => {
        console.log("record data delete");
        a_resp.send( "record data delete" );
    });

    done();
}