'use strict';

module.exports = function(Apapundistricts) {

    Apapundistricts.remoteMethod(
        'getDistricts', {
            accepts: {
                arg: 'data',
                type: 'Object',
                http: { source: 'body' }
            },
            returns: {
                type: 'array', root: true
            },
            http: {
                path: '/getDistricts',
                verb: 'post'
            }
        });

    Apapundistricts.getDistricts = function (params, cb) {
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

};
