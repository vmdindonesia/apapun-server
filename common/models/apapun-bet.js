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
        var ds = Apapunbet.dataSource;
        const sqlRow = "Select * FROM apapun_bet";

        ds.connector.query(sqlRow, function (err, data) {
            if (err) {
                console.log(err, 'ERROR QUERY USER ID');
            } else {
                const ai = data.length + 1;
                Apapunbet.create({
                    betId: 'BET-' + ai,
                    orderId: params.orderId,
                    crafterId: params.crafterId,
                    price: params.price,
                    priceDelivery: params.priceDelivery,
                    status: 'Pending',
                    description: params.description,
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
        if (params.status === 'Approve') {
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
                        Apapunbet.updateAll(
                            { orderId: params.orderId, status: 'Pending' },
                            {
                                status: 'Cancel'
                            },
                            function (error, token) {
                                console.log(token);
                                if (error) {
                                    cb(error);
                                    console.log(error.statusCode, 'Errornya');
                                } else {
                                    let createLogModel = app.models.ApapunOrderLog;
                                    createLogModel.create({
                                        description: "Approve Bet Order",
                                        orderId: params.orderId,
                                        status: "3"
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

    Apapunbet.remoteMethod('getBetCrafterByOrder', {
        accepts: [{
            arg: 'params',
            type: 'object',
            required: true,
            http: { source: 'body' }
        }, {
            arg: "options",
            type: "object",
            http: "optionsFromRequest"
        }],
        returns: {
            arg: 'getBetCrafterByOrder', type: 'Object', root: true
        },
        http: {
            path: '/getBetCrafterByOrder',
            verb: 'post'
        },
        description: [
            'This instance for User Authentication user APAPUN.COM',
        ]
    });

    Apapunbet.getBetCrafterByOrder = function (params, options, cb) {
        console.log(params, 'Params')
        let OrderModel = app.models.ApapunOrder;
        OrderModel.find({
            where: { orderId: params.orderId },
            include: [
                {
                    relation: 'ApapunBet',
                    scope: {
                        include: [
                            {
                                relation: 'ApapunCrafter',
                                scope: {
                                    include: [
                                        {
                                            relation: 'ApapunUsers',
                                            scope: {
                                                fields: ['id'],
                                                include: [
                                                    {
                                                        relation: 'ApapunUsersAddress',
                                                        scope: {
                                                            include: [
                                                                ['ApapunProvinces', 'ApapunRegencies', 'ApapunDistricts']
                                                            ]
                                                        }
                                                    }
                                                ]
                                            }
                                        }
                                    ]
                                }
                            }
                        ]
                    }
                }
            ]
        }, function (err, result) {
            if (err) {
                cb(err);
            } else {
                cb(null, result);
            }
        });
    };

    Apapunbet.remoteMethod('getBetCrafterByCrafterId', {
        accepts: [{
            arg: 'params',
            type: 'object',
            required: true,
            http: { source: 'body' }
        }, {
            arg: "options",
            type: "object",
            http: "optionsFromRequest"
        }],
        returns: {
            arg: 'getBetCrafterByCrafterId', type: 'Object', root: true
        },
        http: {
            path: '/getBetCrafterByCrafterId',
            verb: 'post'
        },
        description: [
            'This instance for User Authentication user APAPUN.COM',
        ]
    });

    Apapunbet.getBetCrafterByCrafterId = function (params, options, cb) {
        console.log(params, 'Params');
        var ds = Apapunbet.dataSource;
        const sqlRow = " SELECT a.*, b.id_user, c.realm, d.`name` as subkategori, e.name as kategori, f.name as image_order"
            + " FROM `apapun_bet` as a"
            + " LEFT JOIN apapun_order as b on b.order_id = a.order_id"
            + " LEFT JOIN apapun_users as c on c.id = b.id_user"
            + " LEFT JOIN apapun_subkategori as d on d.id = b.unit_category_product"
            + " LEFT JOIN apapun_kategori as e on e.id = d.kategori_id"
            + " LEFT JOIN apapun_images as f on f.id_order = a.order_id"
            + " WHERE a.crafter_id = '" + params.crafterId + "'"
            + " GROUP BY a.order_id";
        ds.connector.query(sqlRow, function (err, data) {
            if (err) {
                console.log(err, 'ERROR QUERY USER ID');
            } else {
                cb(err, data);
            }
        });
    };

    Apapunbet.remoteMethod('getBetByBetCrafter', {
        accepts: [{
            arg: 'params',
            type: 'object',
            required: true,
            http: { source: 'body' }
        }, {
            arg: "options",
            type: "object",
            http: "optionsFromRequest"
        }],
        returns: {
            arg: 'getBetByBetCrafter', type: 'Object', root: true
        },
        http: {
            path: '/getBetByBetCrafter',
            verb: 'post'
        },
        description: [
            'This instance for User Authentication user APAPUN.COM',
        ]
    });

    Apapunbet.getBetByBetCrafter = function (params, options, cb) {
        console.log(params, 'Params')
        Apapunbet.find({
            where: { crafterId: params.crafterId, orderId: params.orderId }
        }, function (err, result) {
            if (result) {
                cb(err, result);
            } else {
                cb(err);
            }
        });
    };
};
