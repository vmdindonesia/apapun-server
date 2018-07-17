'use strict';

module.exports = function(Apapunmaterial) {
    let request = require("request");
    let app = require("../../server/server");
    Apapunmaterial.remoteMethod(
        'CreateNewMaterial', {
            accepts: [{
                arg: 'params',
                type: 'ApapunMaterial',
                required: true,
                http: { source: 'body' }
            }, {
                arg: "options",
                type: "object",
                http: "optionsFromRequest"
            }],
            returns: {
                arg: 'CreateNewMaterial', type: 'ApapunMaterial', root: true
            },
            http: {
                path: '/CreateNewMaterial',
                verb: 'post'
            },
            description: [
                'This instance for Create New Material',
            ]
        });
    Apapunmaterial.CreateNewMaterial = function (params, options, cb) {
        console.log(params, 'Params');
        Apapunmaterial.create({
            materialName : params.materialName,
            createdUserId : params.createdUserId
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
