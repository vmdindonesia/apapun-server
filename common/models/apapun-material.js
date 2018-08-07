'use strict';

module.exports = function(Apapunmaterial) {
    let request = require("request");
    let app = require("../../server/server");

    
    Apapunmaterial.remoteMethod(
        'GetMaterialAuto', {
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
                arg: 'GetMaterialAuto', type: 'object', root: true
            },
            http: {
                path: '/GetMaterialAuto',
                verb: 'post'
            },
            description: [
                'This instance for Autocomplete Material',
            ]
        });
    Apapunmaterial.GetMaterialAuto = function (params, options, cb) {
        console.log(params, 'Params');
        var ds = Apapunmaterial.dataSource;
        const sqlRow = " SELECT * FROM `apapun_material` WHERE material_name like '%"+params.keyword+"%' ORDER BY material_name asc limit 6";
        ds.connector.query(sqlRow, function (err, data) {
            if (err) {
                console.log(err, 'ERROR QUERY USER ID');
            } else {
                cb(err,data);
            }
        });
    };

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
