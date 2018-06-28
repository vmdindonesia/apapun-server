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
        console.log(params.params, 'Params')

        ApapunSubkategori.find({
            where:
                { kategoriId: params.params.kategoriId }
        }, function (err, result) {
            if (result) {
                console.log(result);
                cb(err, result);
            } else {
                cb(err);
            }
        })
    };
};
