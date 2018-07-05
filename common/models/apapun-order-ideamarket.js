'use strict';

module.exports = function(Apapunorderideamarket) {
    let request = require("request");
    let app = require("../../server/server");

    Apapunorderideamarket.remoteMethod(
        'CreateOrderIdeaMarket', {
            accepts: [{
                arg: 'params',
                type: 'ApapunOrderIdeamarket',
                required: true,
                http: { source: 'body' }
            }, {
                arg: "options",
                type: "object",
                http: "optionsFromRequest"
            }],
            returns: {
                arg: 'CreateOrderIdeaMarket', type: 'ApapunOrderIdeamarket', root: true
            },
            http: {
                path: '/CreateOrderIdeaMarket',
                verb: 'post'
            },
            description: [
                'This instance for User Authentication user APAPUN.COM',
            ]
        });
    Apapunorderideamarket.CreateOrderIdeaMarket = function (params, options, cb, next) {
        console.log(params, 'Params Nya');

        var ds = Apapunorderideamarket.dataSource;
        const sqlRow = "Select * FROM apapun_order_ideamarket";

        ds.connector.query(sqlRow, function (err, data) {
            if (err) {
                console.log(err, 'ERROR QUERY USER ID');
            } else {
                console.log(data.length, 'Data Query Manual');
                const ai = data.length + 1;
                var dataOrderIdeaMarket = {
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
                    typeOrder: 'Idea Market',
                    dataImages: params.nameFileImages
                };
                console.log(dataOrderIdeaMarket, 'Idea Market');
                Apapunorderideamarket.create(dataOrderIdeaMarket, function (error, resultOrder) {
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
                                        orderId: resultOrder.orderId,
                                        type: 'Idea Market'
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
};
