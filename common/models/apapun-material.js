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
        var slug = params.name.replace(" ", "-");
        Apapunmaterial.create({
            name : params.name,
            slug : slug.toLowerCase(),
            parentId : params.parent_id,
            username : params.user_id,
            active: 1
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
