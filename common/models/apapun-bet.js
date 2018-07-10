'use strict';

module.exports = function (Apapunbet) {
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
            priceDelivery: params.priceDelivery,
            status: 'pending',
            description: params.description,
            createdAt: params.createdAt,
            finishOrder: params.finishOrder
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
        'ApproveBet', {
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
                arg: 'ApproveBet', type: 'ApapunBet', root: true
            },
            http: {
                path: '/ApproveBet',
                verb: 'post'
            },
            description: [
                'This instance for User Authentication user APAPUN.COM',
            ]
        });

    Apapunbet.ApproveBet = function (params, options, cb) {
        if (params.status === 'approve') {
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
                        // cb(error, token);
                        Apapunbet.updateAll(
                            { orderId: params.orderId, status: 'pending' },
                            {
                                status: 'cancel'
                            },
                            function (error, token) {
                                console.log(token);
                                if (error) {
                                    cb(error);
                                    console.log(error.statusCode, 'Errornya');
                                } else {
                                    // cb(error, token);
                                    let createLogModel = app.models.ApapunOrderLog;
                                    createLogModel.create({
                                        description: params.description,
                                        orderId: params.orderId,
                                        status: "2"
                                    }, function (error, token) {
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
                    }
                });
        } else {
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
    }

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
                'This instance for Crafter Edit Price user APAPUN.COM',
            ]
        });

        Apapunbet.EditBet = function (params, options, cb) {
            Apapunbet.findbyId(params.betId, function (err, data) {
                if (err) {
                    // cb(err);
                } else {
                    // cb(err, data);
    
                    console.log(params.phone, 'TELEPON')
                    Apapunbet.updateAll(
                        { betId: params.betId },
                        {
                            price: params.price,
                            priceDelivery: params.priceDelivery,
                            description: params.description
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
