'use strict';

module.exports = function(Apapuncrafternote) {
    let request = require("request");
    let app = require("../../server/server");

    Apapuncrafternote.remoteMethod('CreateCrafterNote', {
        accepts: [{
            arg: 'params',
            type: 'ApapunCrafterNote',
            required: true,
            http: { source: 'body' }
        }, {
            arg: "options",
            type: "object",
            http: "optionsFromRequest"
        }],
        returns: {
            arg: 'CreateCrafterNote', type: 'ApapunCrafterNote', root: true
        },
        http: {
            path: '/CreateCrafterNote',
            verb: 'post'
        },
        description: [
            'This instance for User Authentication user APAPUN.COM',
        ]
    });

    Apapuncrafternote.CreateCrafterNote = function (params, options, cb) {
        console.log(params, 'Params');
        Apapuncrafternote.create(params, function (error, token) {
            console.log(token);
            if (error) {
                console.log(error, 'Errornya');
                cb(error);
            } else {
                cb(error, token);
            }
        });
    };

    Apapuncrafternote.remoteMethod(
        'getCrafterNote', {
            accepts: [{
                arg: 'params',
                type: 'object',
                required: true,
                http: { source: 'body' }
            }, {
                arg: "options",
                type: "object",
                http: "optionsFromRequest"
            }],
            returns: {
                arg: 'getCrafterNote', type: 'object', root: true
            },
            http: {
                path: '/getCrafterNote',
                verb: 'post'
            },
            description: [
                'This instance for User Authentication user APAPUN.COM',
            ]
        });
    Apapuncrafternote.getCrafterNote = function (params, options, cb, next) {
        console.log(params, 'Params Nya');
        Apapuncrafternote.find(
            {
                where : {crafterId:params.crafterId}
            }, function (error, result) {
            if (error) {
                cb(error);
                console.log(error.statusCode, 'Errornya');
            } else {
                console.log(result);
                cb(error,result);
            }
        });
    };

    Apapuncrafternote.remoteMethod(
        'updateCrafterNote', {
            accepts: [{
                arg: 'params',
                type: 'ApapunCrafterNote',
                required: true,
                http: { source: 'body' }
            }, {
                arg: "options",
                type: "object",
                http: "optionsFromRequest"
            }],
            returns: {
                arg: 'updateCrafterNote', type: 'ApapunCrafterNote', root: true
            },
            http: {
                path: '/updateCrafterNote',
                verb: 'post'
            },
            description: [
                'This instance for User Authentication user APAPUN.COM',
            ]
        });
    Apapuncrafternote.updateCrafterNote = function (params, options, cb) {
        Apapuncrafternote.find({id:params.id, crafterId:params.crafterId}, function (err, data) {
            if (err) {
                cb(err);
            } else {
                Apapuncrafternote.updateAll(
                    { id:params.id,crafterId: params.crafterId },
                    {
                        subject:params.subject,
                        note:params.note
                    },
                    function (error, token) {
                        console.log(token);
                        if (error) {
                            cb(error);
                            console.log(error.statusCode, 'Errornya');
                        } else {
                            cb(error, token);
                        }
                    });
            }
        });
    };

    Apapuncrafternote.remoteMethod(
        'deleteCrafterNote', {
            accepts: [{
                arg: 'params',
                type: 'ApapunCrafterNote',
                required: true,
                http: { source: 'body' }
            }, {
                arg: "options",
                type: "object",
                http: "optionsFromRequest"
            }],
            returns: {
                arg: 'deleteCrafterNote', type: 'ApapunCrafterNote', root: true
            },
            http: {
                path: '/deleteCrafterNote',
                verb: 'post'
            },
            description: [
                'This instance for User Authentication user APAPUN.COM',
            ]
        });
    Apapuncrafternote.deleteCrafterNote = function (params, options, cb) {
        Apapuncrafternote.find({id:params.id, crafterId:params.crafterId}, function (err, data) {
            if (err) {
                cb(err);
            } else {
                Apapuncrafternote.destroyAll(
                    { id:params.id,crafterId: params.crafterId },
                    function (error, token) {
                        console.log(token);
                        if (error) {
                            cb(error);
                            console.log(error.statusCode, 'Errornya');
                        } else {
                            cb(error, token);
                        }
                    });
            }
        });
    };

};
