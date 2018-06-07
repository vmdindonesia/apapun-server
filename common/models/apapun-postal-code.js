'use strict';

module.exports = function(Apapunpostalcode) {

    Apapunpostalcode.remoteMethod(
        'getPostalCode', {
            accepts: {
                arg: 'data',
                type: 'Object',
                http: { source: 'body' }
            },
            returns: {
                type: 'array', root: true
            },
            http: {
                path: '/getPostalCode',
                verb: 'post'
            }
        });

        Apapunpostalcode.getPostalCode = function (params, cb) {
        console.log(params, 'Params')

        Apapunpostalcode.find({
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

};
