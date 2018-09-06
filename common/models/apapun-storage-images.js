'use strict';

module.exports = function (ApapunStorageImages) {
    ApapunStorageImages.remoteMethod(
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

    ApapunStorageImages.imagesUpload = function (req, res, options, cb) {
        ApapunStorageImages.upload(req, res, { container: 'images' }, options, cb);
    }
};
