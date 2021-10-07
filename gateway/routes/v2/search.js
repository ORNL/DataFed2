module.exports = function ( app, opts, done ) {

    app.post( '/run', ( a_req, a_resp ) => {
        console.log("search run");
        a_resp.send( "search run" );
    });

     app.post( '/save', ( a_req, a_resp ) => {
        console.log("search save");
        a_resp.send( "search save" );
    });

    app.get( '/saved/list', ( a_req, a_resp ) => {
        console.log("search saved list");
        a_resp.send("search saved list");
    });

    app.post( '/saved/run', ( a_req, a_resp ) => {
        console.log("search saved run");
        a_resp.send("search saved run");
    });

    app.get( '/saved/view', ( a_req, a_resp ) => {
        console.log("search saved view");
        a_resp.send("search saved view");
    });

    app.post( '/saved/update', ( a_req, a_resp ) => {
        console.log("search saved update");
        a_resp.send("search saved lisupdatet");
    });

    app.post( '/saved/delete', ( a_req, a_resp ) => {
        console.log("search saved delete");
        a_resp.send("search saved delete");
    });

    done();
}
