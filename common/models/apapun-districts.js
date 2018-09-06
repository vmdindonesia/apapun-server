'use strict';

module.exports = function(Apapundistricts) {

    Apapundistricts.remoteMethod(
        'getDistrictsByRegencyId', {
            accepts: {
                arg: 'data',
                type: 'Object',
                required: true,
                http: { source: 'body' }
            },
            returns: {
                type: 'array', root: true
            },
            http: {
                path: '/getDistrictsByRegencyId',
                verb: 'post'
            }
        });

    Apapundistricts.getDistrictsByRegencyId = function (params, cb) {
        console.log(params, 'Params')

        Apapundistricts.find({
            where:
                { regencyId: params.regencyId }
        }, function (err, result) {
            if (result) {
                cb(err, result);
            } else {
                cb(err);
            }
        })
    };

    Apapundistricts.remoteMethod(
        'getDistrictAuto', {
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
                arg: 'getDistrictAuto', type: 'object', root: true
            },
            http: {
                path: '/getDistrictAuto',
                verb: 'post'
            },
            description: [
                'This instance for User Authentication user APAPUN.COM',
            ]
        });
    Apapundistricts.getDistrictAuto = function (params, options, cb, next) {
        console.log(params, 'Params Nya');
        var ds = Apapundistricts.dataSource;
        const sql = " SELECT * FROM `apapun_districts` WHERE `name` like '%"+params.keyword+"%' AND regency_id = '"+params.regency_id+"' LIMIT 6";
        ds.connector.execute(sql, function (err, result) {
            if (err) {
                cb(err);
                return;
            }else{
                cb(null,result);
            }
        });
    };

};
