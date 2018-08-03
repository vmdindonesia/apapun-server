'use strict';

module.exports = function (Apapunstorage) {
    Apapunstorage.remoteMethod(
        'imagesUpload',
        {
            http: { path: '/imagesUpload', verb: 'post' },
            accepts: [
                { arg: 'req', type: 'object', 'http': { source: 'req' } },
                { arg: 'res', type: 'object', 'http': { source: 'res' } }
            ],
            returns: { arg: 'status', type: 'string' }
        }
    );

    Apapunstorage.imagesUpload = function (req, res, options, cb) {
        Apapunstorage.upload(req, res, { container: 'images' }, options, cb);
    }
};
