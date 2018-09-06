'use strict';

module.exports = function(Apapunimages) {
    let request = require("request");
    let app = require("../../server/server");
    Apapunimages.remoteMethod(
        'CreateCrafterImage', {
            accepts: [{
                arg: 'params',
                type: 'ApapunImages',
                required: true,
                http: { source: 'body' }
            }, {
                arg: "options",
                type: "object",
                http: "optionsFromRequest"
            }],
            returns: {
                arg: 'CreateCrafterImage', type: 'ApapunImages', root: true
            },
            http: {
                path: '/CreateCrafterImage',
                verb: 'post'
            },
            description: [
                'This instance for User Authentication user APAPUN.COM',
            ]
        });
    Apapunimages.CreateCrafterImage = function (params, options, cb, next) {
        console.log(params, 'Params Nya');
        Apapunimages.create(
            {
                idOrder : params.crafterId,
                name:params.name,
                type: "Crafter Image"
            }, function (error, result) {
            if (error) {
                cb(error);
                console.log(error.statusCode, 'Errornya');
            } else {
                cb(error,result);
            }
        });
    };

    Apapunimages.remoteMethod(
        'getCrafterImage', {
            accepts: [{
                arg: 'params',
                type: 'ApapunImages',
                required: true,
                http: { source: 'body' }
            }, {
                arg: "options",
                type: "object",
                http: "optionsFromRequest"
            }],
            returns: {
                arg: 'getCrafterImage', type: 'ApapunImages', root: true
            },
            http: {
                path: '/getCrafterImage',
                verb: 'post'
            },
            description: [
                'This instance for User Authentication user APAPUN.COM',
            ]
        });
    Apapunimages.getCrafterImage = function (params, options, cb, next) {
        console.log(params, 'Params Nya');
        Apapunimages.find(
            {
                where : {idOrder:params.crafterId}
            }, function (error, result) {
            if (error) {
                cb(error);
                console.log(error.statusCode, 'Errornya');
            } else {
                cb(error,result);
            }
        });
    };
};
