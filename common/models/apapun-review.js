'use strict';

module.exports = function(Apapunreview) {
    let request = require("request");
    let app = require("../../server/server");

    Apapunreview.remoteMethod(
        'CreateReview', {
            accepts: [{
                arg: 'params',
                type: 'Apapunreview',
                required: true,
                http: { source: 'body' }
            }, {
                arg: "options",
                type: "object",
                http: "optionsFromRequest"
            }],
            returns: {
                arg: 'CreateReview', type: 'Apapunreview', root: true
            },
            http: {
                path: '/CreateReview',
                verb: 'post'
            },
            description: [
                'This instance for Crafter Edit Price user APAPUN.COM',
            ]
        });

        Apapunreview.CreateReview = function (params, options, cb) {
            console.log(params, 'Params');
            Apapunreview.create({
                id: params.id,
                orderId: params.orderId,
                description: params.description
            }, function (error, token) {
                console.log(token);
                if (error) {
                    cb(error);
                    console.log(error.statusCode, 'Errornya');
                } else {
                    cb(error, token);
                }
            });
        };
};
