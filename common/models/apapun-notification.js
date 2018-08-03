'use strict';

module.exports = function(Apapunnotification) {
    let request = require("request");
    let app = require("../../server/server");
    
    Apapunnotification.remoteMethod(
        'createnotification', {
            accepts: [{
                arg: 'params',
                type: 'Apapunnotification',
                required: true,
                http: { source: 'body' }
            }, {
                arg: "options",
                type: "object",
                http: "optionsFromRequest"
            }],
            returns: {
                arg: 'createnotification', type: 'Apapunnotification', root: true
            },
            http: {
                path: '/createnotification',
                verb: 'post'
            },
            description: [
                'This instance for User Authentication user APAPUN.COM',
            ]
        });
    
        Apapunnotification.createnotification = function (params, options, cb) {
            console.log(params);
            Apapunnotification.create({
                fromId: params.fromId,
                toId: params.toId,
                orderId: params.orderId,
                description: params.description,
                typeNotification: params.typeNotification
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
};


                // id: params.id,
                // idOrder: params.idOrder,
                // typeOrder: params.typeOrder,
                // idMaterial: params.idMaterial