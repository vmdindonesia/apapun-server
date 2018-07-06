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
                    addressIdDelivery: params.addressDelivery,
                    noteDelivery: params.catatanTambahan,
                    quantityProduct: params.numberPcs,
                    unitQuantity: params.unitQuantity,
                    serviceProduct: params.serveDelivery,
                    status: 'Active',
                    unitCategoryProduct: params.categoryProduct,
                    unitSubCategoryProduct: params.subCategoryProduct,
                    typeOrder: 'Custom Order',
                    dataImages: params.nameFileImages
                };
                console.log(dataOrder, 'Data Order');
                Apapunorder.create(dataOrder, function (error, resultOrder) {
                    if (error) {
                        cb(error);
                        console.log(error.statusCode, 'Errornya');
                    } else {
                        console.log(resultOrder, 'Result Order');
                        // let materialModel = app.models.ApapunOrderMaterial;
                        let imagesModel = app.models.ApapunImages;
                        let createLogModel = app.models.ApapunOrderLog;
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
                                cb(err, resultOrderLog);
                                for (var i = 0; i < params.nameFileImages.length; i++) {
                                    imagesModel.create({
                                        name: params.nameFileImages[i],
                                        idOrder: resultOrder.orderId,
                                        type: 'Custom Order'
                                    }, function (err, resultImage) {
                                        if (err) {
                                            cb(err)
                                        } else {
                                            console.log(resultImage, 'Result Images')
                                        }
                                    });
                                }

                                // console.log(params.idMaterial);
                                // for (var i = 0; i < params.idMaterial.length; i++) {
                                //     console.log(token.idMaterial[i], 'ID ORDER');
                                //     materialModel.create({
                                //         idMaterial: params.idMaterial[i],
                                //         idOrder: token.orderId
                                //     }, function (err, data) {
                                //         if (err) {
                                //             console.log(err)
                                //         }
                                //     });
                                // }
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
                            cb(error, token);
                        }
                    });
            }
        });
    };
};
