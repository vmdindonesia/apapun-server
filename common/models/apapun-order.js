'use strict';

module.exports = function (Apapunorder) {
    let request = require("request");
    let app = require("../../server/server");

    Apapunorder.remoteMethod(
        'GetDetailPayment', {
            accepts: {
                arg: 'data',
                type: 'Object',
                http: { source: 'body' }
            },
            returns: {
                type: 'array', root: true
            },
            http: {
                path: '/GetDetailPayment',
                verb: 'post'
            }
        });

    Apapunorder.GetDetailPayment = function (params, cb) {
        console.log(params, 'Params')

        Apapunorder.find({
            where:
                { orderId: params.orderId }
        }, function (err, result) {
            if (result) {
                var responseOrder = {
                    "orderId": result[0].orderId,
                    "quantityProduct": result[0].quantityProduct,
                    "unitQuantity": result[0].unitQuantity,
                    // "crafterId":result[0].ApapunBet[0].crafterId
                }
                let ModelBet = app.models.ApapunBet;
                let ModelCrafter = app.models.ApapunCrafter;
                let ModelUsersBank = app.models.ApapunUsersBank;
                ModelBet.find({
                    where: {
                        orderId: params.orderId,
                        status: "approve"
                    }
                }, function (err, result) {
                    if (err) {
                        cb(err);
                    } else {
                        var responseBet = {
                            "crafterId": result[0].crafterId,
                            "price": result[0].price,
                            "priceDelivery": result[0].priceDelivery
                        }
                        ModelCrafter.find({
                            where: { crafterId: result[0].crafterId }
                        }, function (err, result) {
                            var responseCrafter = {
                                "idUser": result[0].idUser
                            }
                            ModelUsersBank.find({
                                where: { userId: result[0].idUser }
                            }, function (err, result) {
                                if (err) {
                                    cb(err);
                                } else {
                                    var response = {
                                        "orderId": responseOrder.orderId,
                                        "quantityProduct": responseOrder.quantityProduct,
                                        "unitQuantity": responseOrder.unitQuantity,
                                        "crafterId": responseBet.crafterId,
                                        "price": responseBet.price,
                                        "priceDelivery": responseBet.priceDelivery,
                                        "accountHolderName": result[0].accountHolderName,
                                        "accountHolderNumber": result[0].accountHolderNumber,
                                        "bankName": result[0].bankName
                                    };
                                    cb(err, response);
                                }
                            })
                        })
                    }
                })
            } else {
                cb(err);
            }
        })
    };

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
            dataCategory[i] = params.categoryId[i];
        }
        var ds = Apapunorder.dataSource;
        const sql = "SELECT a.name_product, a.order_id, a.unit_category_product, a.quantity_product,"
            + " a.delivery_provider, a.address_id_delivery, a.note_delivery, a.status_order,"
            + " a.id_user,a.created_at,a.unit_quantity,a.type_order,a.publish,c.name as province"
            + " b.district, d.name as city,e.name as district_name,g.id,g.realm,g.email,g.phone"
            + " FROM apapun_order AS a"
            + " LEFT JOIN apapun_users_address AS b ON a.address_id_delivery = b.address_id"
            + " LEFT JOIN apapun_provinces AS c ON b.province = c.id"
            + " LEFT JOIN apapun_regencies AS d ON d.id = b.city"
            + " LEFT JOIN apapun_districts AS e ON e.id = b.district"
            + " LEFT JOIN apapun_users AS g ON a.id_user = g.id"
            + " WHERE a.unit_category_product IN (" + dataCategory + ") AND a.type_order = 'Custom Order'";

        ds.connector.execute(sql, function (err, result) {
            if (err) {
                cb(err);
                return;
            }

            cb(null, result);
        });
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
                                                    let createLogModel = app.models.ApapunOrderLog;

                                                    createLogModel.create({
                                                        description: 'Cancel Order',
                                                        orderId: params.orderId,
                                                        status: '2'
                                                    }, function (error, resultOrderLog) {
                                                        cb(error, resultOrderLog);
                                                    });
                                                }
                                            });
                                    }
                                });
                            };

                            Apapunorder.remoteMethod(
                                'OrderProductReady', {
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
                                        arg: 'OrderProductReady', type: 'object', root: true
                                    },
                                    http: {
                                        path: '/OrderProductReady',
                                        verb: 'post'
                                    },
                                    description: [
                                        'This instance for User Authentication user APAPUN.COM',
                                    ]
                                });
                            Apapunorder.OrderProductReady = function (params, options, cb) {
                                Apapunorder.findById(params.orderId, function (err, data) {
                                    if (err) {
                                        cb(err);
                                    } else {
                                        Apapunorder.updateAll(
                                            { orderId: params.orderId },
                                            {
                                                statusOrder: 'Ready'
                                            },
                                            function (error, token) {
                                                console.log(token);
                                                if (error) {
                                                    cb(error);
                                                } else {
                                                    let createLogModel = app.models.ApapunOrderLog;

                                                    createLogModel.create({
                                                        description: 'Prodct Order Ready' + params.nameProduct,
                                                        orderId: params.orderId,
                                                        status: '6'
                                                    }, function (error, resultOrderLog) {
                                                        cb(error, resultOrderLog);
                                                    });
                                                }
                                            });
                                    }
                                });
                            };

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

    Apapunorder.remoteMethod(
        'getIdeaMarket', {
            accepts: {
                arg: 'data',
                type: 'Object',
                http: { source: 'body' }
            },
            returns: {
                type: 'array', root: true
            },
            http: {
                path: '/getIdeaMarket',
                verb: 'post'
            }
        });

    Apapunorder.getIdeaMarket = function (params, cb) {
        console.log(params, 'Params')
        var dataCategory = [];
        for (var i = 0; i < params.categoryId.length; i++) {
            dataCategory[i] = {
                'unitCategoryProduct': params.categoryId[i]
            }
        }
        console.log(dataCategory, 'XX')
        Apapunorder.find({
            where: {
                or: dataCategory,
                and: [{ typeOrder: params.type_order, publish: 1 }]
            }, include: [
                {
                    relation: 'ApapunUsers',
                    // where: { crafterId: params.crafterId },
                    scope: {
                        fields: ['realm', 'id']
                    }
                }, {
                    relation: 'ApapunImages',
                    scope: { // further filter the owner object
                        // where: { crafterId: params.crafterId },
                        fields: ['name', 'id']
                    }
                }, {
                    relation: 'ApapunApresiasi',
                    scope: { // further filter the owner object
                        // where: { crafterId: params.crafterId },
                        fields: ['price', 'userId']
                    }
                }, {
                    relation: 'ApapunReview'
                }
            ]
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
        'getIdeaMarketById', {
            accepts: {
                arg: 'data',
                type: 'Object',
                http: { source: 'body' }
            },
            returns: {
                type: 'array', root: true
            },
            http: {
                path: '/getIdeaMarketById',
                verb: 'post'
            }
        });

    Apapunorder.getIdeaMarketById = function (params, cb) {
        console.log(params, 'Params')
        Apapunorder.find({
            where: {
                orderId: params.orderId
            }, include: [
                {
                    relation: 'ApapunUsers',
                    // where: { crafterId: params.crafterId },
                    scope: {
                        fields: ['realm', 'id']
                    }
                }, {
                    relation: 'ApapunImages',
                    scope: { // further filter the owner object
                        // where: { crafterId: params.crafterId },
                        fields: ['name', 'id']
                    }
                }, {
                    relation: 'ApapunApresiasi',
                    scope: { // further filter the owner object
                        // where: { crafterId: params.crafterId },
                        fields: ['price', 'userId']
                    }
                }, {
                    relation: 'ApapunReview'
                }
            ]
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
};
