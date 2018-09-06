'use strict';

module.exports = function (Apapunprovinces) {
    Apapunprovinces.remoteMethod(
        'getProvinceAuto', {
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
                arg: 'getProvinceAuto', type: 'object', root: true
            },
            http: {
                path: '/getProvinceAuto',
                verb: 'post'
            },
            description: [
                'This instance for User Authentication user APAPUN.COM',
            ]
        });
    Apapunprovinces.getProvinceAuto = function (params, options, cb, next) {
        console.log(params, 'Params Nya');
        var ds = Apapunprovinces.dataSource;
        const sql = " SELECT * FROM `apapun_provinces` WHERE `name` like '%"+params.keyword+"%' LIMIT 6";
        ds.connector.execute(sql, function (err, result) {
            if (err) {
                cb(err);
                return;
            }else{
                cb(null,result);
            }
        });
    };
    Apapunprovinces.remoteMethod(
        'getProvinceAll', {
            accepts: [{
                arg: 'params',
                type: 'object',
                required: false,
                http: { source: 'body' }
            }, {
                arg: "options",
                type: "object",
                http: "optionsFromRequest"
            }],
            returns: {
                arg: 'getProvinceAll', type: 'object', root: true
            },
            http: {
                path: '/getProvinceAll',
                verb: 'get'
            },
            description: [
                'This instance for User Authentication user APAPUN.COM',
            ]
        });
    Apapunprovinces.getProvinceAll = function (params, options, cb, next) {
        var ds = Apapunprovinces.dataSource;
        const sql = " SELECT * FROM `apapun_provinces` order by name asc";
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
