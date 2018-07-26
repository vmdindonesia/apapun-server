'use strict';

module.exports = function (Apapunorder) {
    let request = require("request");
    let app = require("../../server/server");



    Apapunorder.remoteMethod(
        'getOrderById', {
            accepts: {
                arg: 'data',
                type: 'Object',
                http: { source: 'body' }
            },
            returns: {
                type: 'array', root: true
            },
            http: {
                path: '/getOrderById',
                verb: 'post'
            }
        });

    Apapunorder.getOrderById = function (params, cb) {
        console.log(params, 'Params')

        Apapunorder.find({
            where:
                { orderId: params.orderId },
            include: [
                {
                    relation: 'ApapunOrderMaterial', // include the owner object
                    scope: { // further filter the owner object
                        // where: { crafterId: params.crafterId },
                        fields: ['idSubMaterial'],
                        include: {
                            relation: 'ApapunSubmaterial',
                            scope: {
                                fields: ["materialName", "materialId", "subMaterialId"],
                                include: {
                                    relation: 'ApapunMaterial',
                                    scope: {
                                        fields: ["materialName", "materialId"]
                                    }
                                }
                            }
                        }
                    },
                },
                {
                    relation: 'ApapunImages', // include the owner object
                    scope: { // further filter the owner object
                        // where: { crafterId: params.crafterId },
                        fields: ['name', 'id'], // only show two fields
                    }
                },
                {
                    relation: 'ApapunUsersAddress'
                },
                {
                    relation: 'ApapunKategori'
                }
            ]
        }, function (err, result) {
            if (result) {
                cb(err, result);
            } else {
                cb(err);
            }
        })
    };

    Apapunorder.remoteMethod(
        'CreateOrder', {
            accepts: [{
                arg: 'params',
                type: 'ApapunOrder',
                required: true,
                http: { source: 'body' }
            }, {
                arg: "options",
                type: "object",
                http: "optionsFromRequest"
            }],
            returns: {
                arg: 'CreateOrder', type: 'ApapunOrder', root: true
            },
            http: {
                path: '/CreateOrder',
                verb: 'post'
            },
            description: [
                'This instance for User Authentication user APAPUN.COM',
            ]
        });
    Apapunorder.CreateOrder = function (params, options, cb, next) {
        console.log(params, 'Params Nya');

        var ds = Apapunorder.dataSource;
        const sqlRow = "Select * FROM apapun_order";

        ds.connector.query(sqlRow, function (err, data) {
            if (err) {
                console.log(err, 'ERROR QUERY USER ID');
            } else {
                console.log(data.length, 'Data Query Manual');
                const ai = data.length + 1;
                var dataOrder = {
                    orderId: 'ORDER-' + ai,
                    idUser: params.userId,
                    nameProduct: params.nameProduct,
                    unitCategoryProduct: params.categoryProduct,
                    quantityProduct: params.numberPcs,
                    deliveryProvider: params.serveDelivery,
                    addressIdDelivery: params.addressDelivery,
                    noteDelivery: params.catatanTambahan,
                    statusOrder: 'Active',
                    unitQuantity: params.unitQuantity,
                    typeOrder: 'Custom Order'
                };
                console.log(dataOrder, 'Data Order');
                Apapunorder.create(dataOrder, function (error, resultOrder) {
                    if (error) {
                        cb(error);
                        console.log(error.statusCode, 'Errornya');
                    } else {
                        console.log(resultOrder, 'Result Order');

                        let imagesModel = app.models.ApapunImages;
                        let materialModel = app.models.ApapunOrderMaterial;
                        let createLogModel = app.models.ApapunOrderLog;

                        createLogModel.create({
                            description: 'Create New Order ' + params.nameProduct,
                            orderId: resultOrder.orderId,
                            status: '1'
                        }, function (error, resultOrderLog) {
                            if (error) {
                                // cb(error);
                                console.log(error.statusCode, 'Errornya');
                            } else {
                                console.log(resultOrderLog, 'Result Order Log');
                                console.log(params.propertyPhoto.length, 'Length Gambar');
                                console.log(params.propertyPhoto, 'Data Property Gambar');
                                var imagePOST = [];
                                for (var i = 0; i < params.propertyPhoto.length; i++) {
                                    console.log(params.propertyPhoto[i][0].name, ' Data Per Poto');

                                    imagePOST[i] = {
                                        'name': params.propertyPhoto[i][0].name,
                                        'idOrder': dataOrder.orderId,
                                        'type': 'Custom Order'
                                    };
                                }

                                console.log(imagePOST, 'XXX');
                                imagesModel.create(imagePOST, function (err, resultImage) {
                                    if (err) {
                                        cb(err)
                                    } else {
                                        console.log(resultImage, 'Result Images');
                                        var materialPOST = [];
                                        console.log(params.dataCheckBoxSubMaterial, 'Data Material');
                                        for (var i = 0; i < params.dataCheckBoxSubMaterial.length; i++) {
                                            materialPOST[i] = {
                                                'idSubMaterial': params.dataCheckBoxSubMaterial[i].subMaterialId,
                                                'idOrder': dataOrder.orderId
                                            };
                                        }

                                        materialModel.create(materialPOST, function (err, resultMaterial) {
                                            if (err) {
                                                cb(err)
                                            } else {
                                                console.log(resultMaterial, 'Result MAterial');
                                                cb(err, resultMaterial);
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                });
            }
        });
    };

    Apapunorder.remoteMethod(
        'getOrderActiveByCategory', {
            accepts: {
                arg: 'data',
                type: 'Object',
                http: { source: 'body' }
            },
            returns: {
                type: 'array', root: true
            },
            http: {
                path: '/getOrderActiveByCategory',
                verb: 'post'
            }
        });

    Apapunorder.getOrderActiveByCategory = function (params, cb) {
        console.log(params, 'Params')
        var dataCategory = [];
        for (var i = 0; i < params.categoryId.length; i++) {
            console.log(params.categoryId[i], ' Data Per Poto');
            dataCategory[i] = {
                'unitCategoryProduct': params.categoryId[i]
            }
        }
        console.log(dataCategory, 'XX', params.type_order)
        Apapunorder.find({
            where: {
                or: dataCategory,
                and: [{ typeOrder: params.type_order }]
            }, include: {
                relation: 'ApapunUsers'
            }
}, function (err, result) {
    if (err) {
        console.log(err, 'Error Get Order');
        cb(err);
    } else {
        console.log(result, 'Data Get Order');
        cb(err, result);
    }
})
    };

Apapunorder.remoteMethod(
    'getHistoryOrder', {
        accepts: {
            arg: 'data',
            type: 'Object',
            http: { source: 'body' }
        },
        returns: {
            type: 'array', root: true
        },
        http: {
            path: '/getHistoryOrder',
            verb: 'post'
        }
    });

Apapunorder.getHistoryOrder = function (params, cb) {
    console.log(params, 'Params')

    Apapunorder.find({
        where:
            { idUser: params.idUser }
    }, function (err, result) {
        if (result) {
            cb(err, result);
        } else {
            cb(err);
        }
    })
};

Apapunorder.remoteMethod(
    'PublishToIdeaMarket', {
        accepts: [{
            arg: 'params',
            type: 'ApapunOrder',
            required: true,
            http: { source: 'body' }
        }, {
            arg: "options",
            type: "object",
            http: "optionsFromRequest"
        }],
        returns: {
            arg: 'PublishToIdeaMarket', type: 'ApapunOrder', root: true
        },
        http: {
            path: '/PublishToIdeaMarket',
            verb: 'post'
        },
        description: [
            'This instance for User Authentication user APAPUN.COM',
        ]
    });
Apapunorder.PublishToIdeaMarket = function (params, options, cb, next) {
    console.log(params, 'Params Nya');
    Apapunorder.findById(params.order_id, function (err, data) {
        if (err) {
            cb(err);
        } else {
            console.log(params.order_id, 'ORDER ID')
            Apapunorder.updateAll(
                { orderId: params.order_id },
                {
                    publish: 1,
                },
                function (error, token) {
                    console.log(token);
                    if (error) {
                        cb(error);
                        console.log(error.statusCode, 'Errornya');
                    } else {
                        let apresiasimodel = app.models.ApapunApresiasi;
                        apresiasimodel.findById(params.order_id, function (err, data) {
                            if (err) {
                                cb(err);
                            } else {
                                apresiasimodel.create({
                                    orderId: params.order_id,
                                    price: params.price,
                                    userId: params.username
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
                        })
                    }
                }
            );
        }
    });
};

Apapunorder.remoteMethod(
    'deliveryToCustomer', {
        accepts: [{
            arg: 'params',
            type: 'ApapunOrder',
            required: true,
            http: { source: 'body' }
        }, {
            arg: "options",
            type: "object",
            http: "optionsFromRequest"
        }],
        returns: {
            arg: 'deliveryToCustomer', type: 'ApapunOrder', root: true
        },
        http: {
            path: '/deliveryToCustomer',
            verb: 'post'
        },
        description: [
            'This instance for User Authentication user APAPUN.COM',
        ]
    });
Apapunorder.deliveryToCustomer = function (params, options, cb) {
    Apapunorder.findById(params.betId, function (err, data) {
        if (err) {
            cb(err);
        } else {
            // cb(err, data);

            console.log(params.resiNumber, 'RESI')
            Apapunorder.updateAll(
                { orderId: params.orderId },
                {
                    statusOrder: 'delivered'
                },
                function (error, token) {
                    console.log(token);
                    if (error) {
                        cb(error);
                    } else {
                        let betModel = app.models.ApapunBet;

                        betModel.updateAll(
                            { betId: params.betId },
                            {
                                status: 'delivered'
                            },
                            function (error, token) {
                                console.log(token);
                                if (error) {
                                    cb(error);
                                } else {
                                    let createLogModel = app.models.ApapunOrderLog;
                                    createLogModel.create({
                                        description: params.resiNumber,
                                        orderId: params.orderId,
                                        status: '4'
                                    }, function (error, resultOrderLog) {
                                        if (error) {
                                            cb(error);
                                            console.log(error.statusCode, 'Errornya');
                                        } else {
                                            console.log(params, 'Result Order Log');
                                            cb(err, resultOrderLog);
                                        }
                                    });
                                }
                            });

                    }
                });
        }
    });
};

Apapunorder.remoteMethod(
    'CancelOrder', {
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
            arg: 'CancelOrder', type: 'object', root: true
        },
        http: {
            path: '/CancelOrder',
            verb: 'post'
        },
        description: [
            'This instance for User Authentication user APAPUN.COM',
        ]
    });
Apapunorder.CancelOrder = function (params, options, cb) {
    Apapunorder.findById(params.orderId, function (err, data) {
        if (err) {
            cb(err);
        } else {
            Apapunorder.updateAll(
                { orderId: params.orderId },
                {
                    statusOrder: 'Canceled'
                },
                function (error, token) {
                    console.log(token);
                    if (error) {
                        cb(error);
                    } else {
                        cb(err, token);
                    }
                });
        }
    });
};

Apapunorder.remoteMethod(
    'completeOrder', {
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
            arg: 'completeOrder', type: 'object', root: true
        },
        http: {
            path: '/completeOrder',
            verb: 'post'
        },
        description: [
            'This instance for User Authentication user APAPUN.COM',
        ]
    });
Apapunorder.completeOrder = function (params, options, cb) {
    Apapunorder.findById(params.orderId, function (err, data) {
        if (err) {
            cb(err);
        } else {
            Apapunorder.updateAll(
                { orderId: params.orderId },
                {
                    statusOrder: 'Cpmplete'
                },
                function (error, token) {
                    console.log(token);
                    if (error) {
                        cb(error);
                    } else {
                        let createLogModel = app.models.ApapunOrderLog;

                        createLogModel.create({
                            description: 'Complete Order ' + params.nameProduct,
                            orderId: token.orderId,
                            status: '5'
                        }, function (error, resultOrderLog) {
                            cb(error, resultOrderLog);
                        });
                    }
                });
        }
    });
};

Apapunorder.remoteMethod(
    'LockOrder', {
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
            arg: 'LockOrder', type: 'object', root: true
        },
        http: {
            path: '/LockOrder',
            verb: 'post'
        },
        description: [
            'This instance for User Authentication user APAPUN.COM',
        ]
    });
Apapunorder.LockOrder = function (params, options, cb) {
    Apapunorder.findById(params.orderId, function (err, data) {
        if (err) {
            cb(err);
        } else {
            Apapunorder.updateAll(
                { orderId: params.orderId },
                {
                    statusOrder: 'Locked'
                },
                function (error, token) {
                    console.log(token);
                    if (error) {
                        cb(error);
                    } else {
                        cb(err, token);
                    }
                });
        }
    });
};
};
