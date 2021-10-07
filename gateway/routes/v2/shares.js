module.exports = function ( app, opts, done ) {

    app.get( '/accounts/list', ( a_req, a_resp ) => {
        console.log("shares accounts list");
        a_resp.send( "shares accounts list" );
    });

    app.get( '/items/list', ( a_req, a_resp ) => {
        console.log("shares items list");
        a_resp.send( "shares items list" );
    });


    done();
}