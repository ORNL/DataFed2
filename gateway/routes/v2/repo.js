module.exports = function ( app, opts, done ) {

    app.get( '/list', ( a_req, a_resp ) => {
        console.log("repo list");
        a_resp.send("repo list");
    });

    app.get( '/view', ( a_req, a_resp ) => {
        console.log("repo view");
        a_resp.send("repo view");
    });

    app.post( '/create', ( a_req, a_resp ) => {
        console.log("repo create");
        a_resp.send("repo create");
    });

    app.post( '/update', ( a_req, a_resp ) => {
        console.log("repo update");
        a_resp.send("repo update");
    });

    app.post( '/delete', ( a_req, a_resp ) => {
        console.log("repo delete");
        a_resp.send("repo delete");
    });

    app.get( '/statistics', ( a_req, a_resp ) => {
        console.log("repo statistics");
        a_resp.send("repo statistics");
    });

    app.get( '/alloc/list', ( a_req, a_resp ) => {
        console.log("repo alloc list");
        a_resp.send("repo alloc list");
    });

    done();
}

