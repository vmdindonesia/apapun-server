'use strict';

module.exports = function(ApapunMaterialProduct) {

    ApapunMaterialProduct.remoteMethod(
        'getMaterialProduct', {
            accepts: {
                arg: 'data',
                type: 'Object',
                http: { source: 'body' }
            },
            returns: {
                type: 'array', root: true
            },
            http: {
                path: '/getMaterialProduct',
                verb: 'post'
            }
        });

        ApapunMaterialProduct.getMaterialProduct = function (params, cb) {
        console.log(params, 'Params')

        ApapunMaterialProduct.find({
            where:
                { materialId: params.materialId }
        }, function (err, result) {
            if (result) {
                console.log(result);
                cb(err, result);
            } else {
                cb(err);
            }
        })
    }
};