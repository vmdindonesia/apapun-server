'use strict';

module.exports = function(ApapunSubkategori) {

    ApapunSubkategori.remoteMethod(
        'getSubkategori', {
            accepts: {
                arg: 'data',
                type: 'Object',
                http: { source: 'body' }
            },
            returns: {
                type: 'array', root: true
            },
            http: {
                path: '/getSubkategori',
                verb: 'post'
            }
        });

    ApapunSubkategori.getSubkategori = function (params, cb) {
        console.log(params, 'Params')

        ApapunSubkategori.find({
            where:
                { kategoriId: params.kategoriId }
        }, function (err, result) {
            if (result) {
                cb(err, result);
            } else {
                cb(err);
            }
        })
    };
};
