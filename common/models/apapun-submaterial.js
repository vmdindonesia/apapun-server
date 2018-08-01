'use strict';

module.exports = function(Apapunsubmaterial) {
    let request = require("request");
    let app = require("../../server/server");
    Apapunsubmaterial.remoteMethod(
        'CreateSubMaterial', {
            accepts: [{
                arg: 'params',
                type: 'ApapunSubmaterial',
                required: true,
                http: { source: 'body' }
            }, {
                arg: "options",
                type: "object",
                http: "optionsFromRequest"
            }],
            returns: {
                arg: 'CreateSubMaterial', type: 'ApapunSubmaterial', root: true
            },
            http: {
                path: '/CreateSubMaterial',
                verb: 'post'
            },
            description: [
                'This instance for Create Sub Material',
            ]
        });
    Apapunsubmaterial.CreateSubMaterial = function (params, options, cb) {
        console.log(params, 'Params');
        Apapunsubmaterial.create({
            materialName : params.materialName,
            createdUserId : params.createdUserId,
            materialId : params.materialId
        }, function (error, token) {
            console.log(token);
            if (error) {
                console.log(error, 'Errornya');
            } else {
                cb(error, token);
            }
        });
    };
    Apapunsubmaterial.remoteMethod(
        'GetSubMaterialByMaterialId', {
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
                arg: 'GetSubMaterialByMaterialId', type: 'object', root: true
            },
            http: {
                path: '/GetSubMaterialByMaterialId',
                verb: 'post'
            },
            description: [
                'This instance for Create Sub Material',
            ]
        });
    Apapunsubmaterial.GetSubMaterialByMaterialId = function (params, options, cb) {
        console.log(params, 'Params');
        Apapunsubmaterial.find({
            where : {materialId:params.materialId}
        }, function (error, token) {
            console.log(token);
            if (error) {
                console.log(error, 'Errornya');
            } else {
                cb(error, token);
            }
        });
    };
};
