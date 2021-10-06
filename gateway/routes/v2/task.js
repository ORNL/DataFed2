module.exports = function ( app, opts, done ) {

    app.get( '/list', ( a_req, a_resp ) => {
        console.log("task list");
        a_resp.send( "task list" );
    });

     app.get( '/view', ( a_req, a_resp ) => {
        console.log("task view");
        a_resp.send( "task view" );
    });

    app.post( '/cancel', ( a_req, a_resp ) => {
        console.log("task cancel");
        a_resp.send( "task cancel" );
    });


    done();
}