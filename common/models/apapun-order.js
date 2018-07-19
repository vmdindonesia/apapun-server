'use strict';

module.exports = function (Apapunorder) {
    let request = require("request");
    let app = require("../../server/server");

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

                        let createLogModel = app.models.ApapunOrderLog;
                        let imagesModel = app.models.ApapunImages;
                        let materialModel = app.models.ApapunOrderMaterial;

                        createLogModel.create({
                            description: 'Create New Order ' + params.nameProduct,
                            orderId: resultOrder.orderId,
                            status: '1'
                        }, function (error, resultOrderLog) {
                            if (error) {
                                cb(error);
                                console.log(error.statusCode, 'Errornya');
                            } else {
                                console.log(resultOrderLog, 'Result Order Log');
                                
                                // var imagePOST = [];
                                // for (var i = 0; i < params.photoTemp.length; i++) {
                                //     imagePOST[i] = {
                                //         'name': params.photoTemp[i].,
                                //         'idOrder': dataOrder.orderId,
                                //         'type': 'Custom Order'
                                //     };
                                // }

                                // console.log(imagePOST, 'XXX');
                                // imagesModel.create(imagePOST, function (err, resultImage) {
                                //     if (err) {
                                //         cb(err)
                                //     } else {
                                //         console.log(resultImage, 'Result Images');
                                //         cb(err, resultImage);
                                //     }
                                // });

                                // var materialPOST = [];
                                // for (var i = 0; i < dataOrder.dataMaterial.length; i++) {
                                //     materialPOST[i] = {
                                //         'idSubMaterial' : dataOrder.dataMaterial[i],
                                //         'idOrder' : dataOrder.orderId
                                //     };
                                // }

                                // materialModel.create(materialPOST, function (err, resultMaterial) {
                                //     if (err) {
                                //         cb(err)
                                //     } else {
                                //         console.log(resultMaterial, 'Result MAterial');
                                //         cb(err, resultMaterial);
                                //     }
                                // });
                            }
                        });
                    }
                });
            }
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

                        }
                    });
            }
        });
    };



    //kkkk
};
