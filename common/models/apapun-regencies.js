'use strict';

module.exports = function (Apapunregencies) {

    Apapunregencies.remoteMethod(
        'getRegenciesByProvinceId', {
            accepts: {
                arg: 'data',
                type: 'Object',
                http: { source: 'body' }
            },
            returns: {
                type: 'array', root: true
            },
            http: {
                path: '/getRegenciesByProvinceId',
                verb: 'post'
            }
        });

    Apapunregencies.getRegenciesByProvinceId = function (params, cb) {
        console.log(params, 'Params')

        Apapunregencies.find({
            where:
                { provinceId: params.provinceId }
        }, function (err, result) {
            if (result) {
                cb(err, result);
            } else {
                cb(err);
            }
        })
    };

    Apapunregencies.remoteMethod(
        'getRegenciesAuto', {
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
                arg: 'getRegenciesAuto', type: 'object', root: true
            },
            http: {
                path: '/getRegenciesAuto',
                verb: 'post'
            },
            description: [
                'This instance for User Authentication user APAPUN.COM',
            ]
        });
    Apapunregencies.getRegenciesAuto = function (params, options, cb, next) {
        console.log(params, 'Params Nya');
        var ds = Apapunregencies.dataSource;
        const sql = " SELECT * FROM `apapun_regencies` WHERE `name` like '%"+params.keyword+"%' AND province_id = '"+params.province_id+"' LIMIT 6";
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
