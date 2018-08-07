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
        var ds = Apapunsubmaterial.dataSource;
        const sqlRow = " SELECT a.sub_material_id, a.material_id, a.material_name as submaterial_name, "
                     + " b.material_name FROM `apapun_submaterial` as a"
                     + " LEFT JOIN apapun_material as b on b.material_id = a.material_id"
                     + " WHERE a.material_id = "+params.materialId+"";
        ds.connector.query(sqlRow, function (err, data) {
            if (err) {
                console.log(err, 'ERROR QUERY USER ID');
            } else {
                cb(err,data);
            }
        });
    };
};
