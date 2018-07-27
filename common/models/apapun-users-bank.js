'use strict';

module.exports = function(Apapunusersbank) {
    let request = require("request");
    let app = require("../../server/server");
    Apapunusersbank.remoteMethod(
        'CreateAccountBank', {
            accepts: [{
                arg: 'params',
                type: 'ApapunUsersBank',
                required: true,
                http: { source: 'body' }
            }, {
                arg: "options",
                type: "object",
                http: "optionsFromRequest"
            }],
            returns: {
                arg: 'CreateAccountBank', type: 'ApapunUsersBank', root: true
            },
            http: {
                path: '/CreateAccountBank',
                verb: 'post'
            },
            description: [
                'This instance for User Authentication user APAPUN.COM',
            ]
        });
    Apapunusersbank.CreateAccountBank = function (params, options, cb, next) {
        console.log(params, 'Params Nya');
        Apapunusersbank.create(params, function (error, result) {
            if (error) {
                cb(error);
                console.log(error.statusCode, 'Errornya');
            } else {
                cb(error,result);
            }
        });
    };
};
