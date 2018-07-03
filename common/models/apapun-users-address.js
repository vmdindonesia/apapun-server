'use strict';

module.exports = function(Apapunusersaddress) {

    Apapunusersaddress.remoteMethod(
        'getUserAddress', {
            accepts: {
                arg: 'data',
                type: 'Object',
                http: { source: 'body' }
            },
            returns: {
                type: 'array', root: true
            },
            http: {
                path: '/getUserAddress',
                verb: 'post'
            }
        });

    Apapunusersaddress.getUserAddress = function (params, cb) {
        console.log(params, 'Params address')

        Apapunusersaddress.find({
            where:
                { userId: params.idUser }
        }, function (err, result) {
            if (result) {
                cb(err, result, 'Data Address');
            } else {
                cb(err);
            }
        })
    };

};
