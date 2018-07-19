'use strict';

module.exports = function(Apapunstorage) {
    Apapunstorage.upload = function(req,res,cb) {
           Apapunstorage.createContainer({name:user.name},function(err,c) {
            Apapunstorage.upload(req,res,{container: 'images'},cb)
           });
        }
        Apapunstorage.remoteMethod (
           'upload',
           {
            http: {path: '/upload', verb: 'post'},
            accepts: [
               {arg: 'req', type: 'object', 'http': {source: 'req'}},
               {arg: 'res', type: 'object', 'http': {source: 'res'}}
            ],
            returns: {arg: 'status', type: 'string'}
           }
        );
};
