'use strict';

module.exports = function(Apapunbet) {
    let request = require("request");
    let app = require("../../server/server");

    Apapunbet.remoteMethod(
        'CreateBet', {
            accepts: [{
                arg: 'params',
                type: 'ApapunBet',
                required: true,
                http: { source: 'body' }
            }, {
                arg: "options",
                type: "object",
                http: "optionsFromRequest"
            }],
            returns: {
                arg: 'CreateBet', type: 'ApapunBet', root: true
            },
            http: {
                path: '/CreateBet',
                verb: 'post'
            },
            description: [
                'This instance for User Authentication user APAPUN.COM',
            ]
        });
    
        Apapunbet.CreateBet = function (params, options, cb) {
            console.log(params, 'Params');
            Apapunbet.create({
                betId: params.betId,
                orderId: params.orderId,
                crafterId: params.crafterId,
                price: params.price,
                status: 'pending',
                description: params.description,
                createdAt: params.createdAt
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

    Apapunbet.remoteMethod(
            'EditBet', {
                accepts: [{
                    arg: 'params',
                    type: 'ApapunBet',
                    required: true,
                    http: { source: 'body' }
                }, {
                    arg: "options",
                    type: "object",
                    http: "optionsFromRequest"
                }],
                returns: {
                    arg: 'EditBet', type: 'ApapunBet', root: true
                },
                http: {
                    path: '/EditBet',
                    verb: 'post'
                },
                description: [
                    'This instance for User Authentication user APAPUN.COM',
                ]
        });

        Apapunbet.EditBet = function (params, options, cb) {
                    Apapunbet.updateAll(
                        { crafterId: params.crafterId },
                        {
                            status: params.status
                        },
                        function (error, token) {
                            console.log(token);
                            if (error) {
                                cb(error);
                                console.log(error.statusCode, 'Errornya');
                            } else {
                                cb(error, token);
                            }
                        });
                }
};
