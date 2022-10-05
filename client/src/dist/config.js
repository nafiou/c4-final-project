"use strict";
exports.__esModule = true;
exports.authConfig = exports.apiEndpoint = void 0;
// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
var apiId = 'rc8hxyesuh';
exports.apiEndpoint = "https://" + apiId + ".execute-api.us-east-1.amazonaws.com/dev";
exports.authConfig = {
    // TODO: Create an Auth0 application and copy values from it into this map. For example:
    // domain: 'dev-nd9990-p4.us.auth0.com',
    domain: 'dev-e898u4f7.us.auth0.com',
    clientId: 'IZorLuj1KQY803K84NkNQ7oHSQv4SGe1',
    callbackUrl: 'http://localhost:3000/callback'
};
