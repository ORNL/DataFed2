module.exports = function ( app, opts, done ) {

    app.get( '/category/list', ( a_req, a_resp ) => {
        console.log("catalog category list");
        a_resp.send("catalog category list");
    });

    app.post( '/category/search', ( a_req, a_resp ) => {
        console.log("catalog category search");
        a_resp.send("catalog category search");
    });

    app.get( '/category/view', ( a_req, a_resp ) => {
        console.log("catalog category view");
        a_resp.send("catalog category view");
    });

    done();
}