'use strict';

module.exports = function(Apapunpaymentmethod) {
    let request = require("request");
    let app = require("../../server/server");

    Apapunpaymentmethod.remoteMethod(
        'createPayment', {
            accepts: [{
                arg: 'params',
                type: 'Apapunpaymentmethod',
                required: true,
                http: { source: 'body' }
            }, {
                arg: "options",
                type: "object",
                http: "optionsFromRequest"
            }],
            returns: {
                arg: 'createPayment', type: 'Apapunpaymentmethod', root: true
            },
            http: {
                path: '/createPayment',
                verb: 'post'
            },
            description: [
                'This instance for User Authentication user APAPUN.COM',
            ]
        });

        Apapunpaymentmethod.createPayment = function (params, options, cb) {
            console.log(params, 'Params');
            Apapunpaymentmethod.create({
                orderId: params.orderId,
                userId: params.userId,
                noRek: params.noRek,
                viaBank: params.viaBank,
                status: params.status,
                nominal: params.nominal,
                received: params.received,
                viaTransfer: params.viaTransfer
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

        Apapunpaymentmethod.remoteMethod(
            'confirmPayment', {
                accepts: [{
                    arg: 'params',
                    type: 'Apapunpaymentmethod',
                    required: true,
                    http: { source: 'body' }
                }, {
                    arg: "options",
                    type: "object",
                    http: "optionsFromRequest"
                }],
                returns: {
                    arg: 'confirmPayment', type: 'Apapunpaymentmethod', root: true
                },
                http: {
                    path: '/confirmPayment',
                    verb: 'post'
                },
                description: [
                    'This instance for User Authentication user APAPUN.COM',
                ]
            });

            Apapunpaymentmethod.confirmPayment = function (params, options, cb) {
                console.log(params,"PARAMETER")
                Apapunpaymentmethod.find({
                    where: {
                        orderId:params.orderId
                    }
                }, function (err, data) {
                    if (err) {
                        cb(err);
                    } else {
                        Apapunpaymentmethod.updateAll(
                            { orderId: params.orderId },
                            {
                                status : "confirmed"
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
                });
            };
};
