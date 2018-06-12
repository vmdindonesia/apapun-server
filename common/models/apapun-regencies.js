'use strict';

module.exports = function (Apapunregencies) {

    Apapunregencies.remoteMethod(
        'getRegencies', {
            accepts: {
                arg: 'data',
                type: 'Object',
                http: { source: 'body' }
            },
            returns: {
                type: 'array', root: true
            },
            http: {
                path: '/getRegencies',
                verb: 'post'
            }
        });

    Apapunregencies.getRegencies = function (params, cb) {
        console.log(params, 'Params')

        Apapunregencies.find({
            where:
                { provinceId: params.id }
        }, function (err, result) {
            if (result) {
                cb(err, result);
            } else {
                cb(err);
            }
        })
    };

};
