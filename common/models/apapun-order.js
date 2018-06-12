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
        console.log(params, 'Params');
        Apapunorder.create(params, function (error, token) {
            // console.log(token);
            if (error) {
                cb(error);
                console.log(error.statusCode, 'Errornya');
            } else {
                console.log(token, 'TOKEN');
                let materialModel = app.models.ApapunOrderMaterial;
                let imagesModel = app.models.ApapunImages;
                for (var i = 0; i < params.idMaterial.length; i++) {
                    console.log(token.id, 'ID ORDER');
                    materialModel.create({
                        idMaterial: params.idMaterial[i],
                        idOrder: token.id
                    }, function (err, data) {
                        if (err) {
                            console.log(err)
                        }
                    });
                }
                
                for (var i = 0; i < params.idImages.length; i++) {
                    console.log(token.id, 'ID ORDER');
                    imagesModel.create({
                        name: params.idImages[i],
                        idOrder: token.id,
                        type:"order"
                    }, function (err, data) {
                        if (err) {
                            console.log(err)
                        }
                    });
                }
                cb(error,token);
            }
        });
    };
};
