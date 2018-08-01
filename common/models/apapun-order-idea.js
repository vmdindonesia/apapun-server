'use strict';

module.exports = function(Apapunorderidea) {
    let request = require("request");
    let app = require("../../server/server");

    Apapunorderidea.remoteMethod(
        'CreateOrderIdea', {
            accepts: [{
                arg: 'params',
                type: 'ApapunOrderIdea',
                required: true,
                http: { source: 'body' }
            }, {
                arg: "options",
                type: "object",
                http: "optionsFromRequest"
            }],
            returns: {
                arg: 'CreateOrderIdea', type: 'ApapunOrderIdea', root: true
            },
            http: {
                path: '/CreateOrderIdea',
                verb: 'post'
            },
            description: [
                'This instance for User Authentication user APAPUN.COM',
            ]
        });
    Apapunorderidea.CreateOrderIdea = function (params, options, cb, next) {
        console.log(params, 'Params Nya');

        var ds = Apapunorderidea.dataSource;
        const sqlRow = "Select * FROM apapun_order_idea";

        ds.connector.query(sqlRow, function (err, data) {
            if (err) {
                console.log(err, 'ERROR QUERY USER ID');
            } else {
                console.log(data.length, 'Data Query Manual');
                const ai = data.length + 1;
                var dataOrder = {
                    ideaOrderId: 'ORDERIDEA-' + ai,
                    idUser: params.idUser,
                    quantityProduct: params.quantityProduct,
                    deliveryProvider: params.deliveryProvider,
                    addressIdDelivery: params.addressIdDelivery,
                    statusOrder: 'Active',
                    unitQuantity: params.unitQuantity,
                    orderId:params.orderId
                };
                console.log(dataOrder, 'Data Order');
                Apapunorderidea.create(dataOrder, function (error, resultOrder) {
                    if (error) {
                        cb(error);
                        console.log(error.statusCode, 'Errornya');
                    } else {
                        cb(null,resultOrder);
                    }
                });
            }
        });
    };
};
