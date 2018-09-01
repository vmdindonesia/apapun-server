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
        if(params.materialId.length >0){
            var submaterialid = "WHERE a.material_id = '"+parseInt(params.materialId)+"'";
        }else{
            var submaterialid = "";
        }
        if(params.text.length >0){
            var text = "AND a.material_name like '%"+params.text+"%'";
        }else{
            var text = "";
        }
        var ds = Apapunsubmaterial.dataSource;
        const sqlRow = " SELECT a.sub_material_id, a.material_id, a.material_name as submaterial_name, "
                     + " b.material_name FROM `apapun_submaterial` as a"
                     + " LEFT JOIN apapun_material as b on b.material_id = a.material_id "
                     + submaterialid+" "+text;
        ds.connector.query(sqlRow, function (err, data) {
            if (err) {
                console.log(err, 'ERROR QUERY USER ID');
            } else {
                cb(err,data);
            }
        });
    };

    Apapunsubmaterial.remoteMethod(
        'GetSubMaterialAuto', {
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
                arg: 'GetSubMaterialAuto', type: 'object', root: true
            },
            http: {
                path: '/GetSubMaterialAuto',
                verb: 'post'
            },
            description: [
                'This instance for Autocomplete Material',
            ]
        });
    Apapunsubmaterial.GetSubMaterialAuto = function (params, options, cb) {
        console.log(params, 'Params');
        var wherekeyword = "";
        if(params.keyword != ""){
            wherekeyword = "AND a.material_name like '%"+params.keyword+"%'";
        }
        var ds = Apapunsubmaterial.dataSource;
        const sqlRow = " SELECT a.sub_material_id, a.material_name as submaterial_name, a.material_id, b.material_name"
                     + " FROM `apapun_submaterial` as a "
                     + " LEFT JOIN apapun_material as b on b.material_id = a.material_id"
                     + " WHERE a.material_id = '"+params.materialId+"' "+wherekeyword+" ORDER BY a.material_name asc limit 6";
        ds.connector.query(sqlRow, function (err, data) {
            if (err) {
                console.log(err, 'ERROR QUERY USER ID');
            } else {
                cb(err,data);
            }
        });
    };
};
