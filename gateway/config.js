var config = {};

config.host = process.env.DATAFED_GATEWAY_HOST || "0.0.0.0";
config.port = process.env.DATAFED_GATEWAY_PORT || 80;
config.tls = process.env.DATAFED_GATEWAY_USE_TLS || "false";
config.client_id = process.env.DATAFED_CLIENT_ID || "19e7a1e1-762b-4d56-8c41-cbef90afb82f";
config.client_secret = process.env.DATAFED_CLIENT_SECRET || "cIj5qu5q2HYV9yl2cGFdZPbLKUGAuDfYh05BzZAMGow=";
config.globus_authorize_url = "https://auth.globus.org/v2/oauth2/authorize";
config.globus_token_url = "https://auth.globus.org/v2/oauth2/token";
config.token_secret = process.env.DATAFED_GATEWAY_TOKEN_SECRET || "Xh6-7puYwW-08TyF+67Sfd";
config.token_exp = process.env.DATAFED_GATEWAY_TOKEN_EXP || "72h";
config.web_cert = process.env.DATAFED_GATEWAY_WEB_CERT || "gateway.crt";
config.web_key = process.env.DATAFED_GATEWAY_WEB_KEY || "gateway.key";
config.sess_cookie_opts = {
    path: '/v2/api',
    secure: true,
    httpOnly: true,
    sameSite: "lax",
    maxAge: 3600
}

if ( typeof config.port === "string" ){
    config.port = parseInt( config.port );
}

if ( config.tls == "1" || config.tls == "yes" || config.tls == "true" ){
    config.tls = true;
}else{
    config.tls = false;
}

module.exports = config;