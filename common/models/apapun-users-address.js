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
        console.log(params, 'Params')

        Apapunusersaddress.find({
            where:
                { username: params.username }
        }, function (err, result) {
            if (result) {
                cb(err, result);
            } else {
                cb(err);
            }
        })
    };

};
