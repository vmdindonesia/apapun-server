'use strict';

module.exports = function(Apapuncrafter) {
    let request = require("request");
    let app = require("../../server/server");

    Apapuncrafter.remoteMethod('CrafterRegister', {
        accepts: [{
            arg: 'params',
            type: 'ApapunCrafter',
            required: true,
            http: { source: 'body' }
        }, {
            arg: "options",
            type: "object",
            http: "optionsFromRequest"
        }],
        returns: {
            arg: 'CrafterRegister', type: 'ApapunCrafter', root: true
        },
        http: {
            path: '/CrafterRegister',
            verb: 'post'
        },
        description: [
            'This instance for User Authentication user APAPUN.COM',
        ]
    });
    
    Apapuncrafter.CrafterRegister = function (params, options, cb) {
        console.log(params, 'Params');
        Apapuncrafter.create(params, function (error, token) {
            console.log(token);
            if (error) {
                console.log(error, 'Errornya');
            } else {
                console.log(token);
                cb(error, token);
            }
        });
    };

    Apapuncrafter.remoteMethod(
        'CrafterAuth', {
            accepts: [{
                arg: 'params',
                type: 'Object',
                required: true,
                http: { source: 'body' }
            }, {
                arg: "options",
                type: "object",
                http: "optionsFromRequest"
            }],
            returns: {
                arg: 'Log in Auth', type: 'array', root: true
            },
            http: {
                path: '/CrafterAuth',
                verb: 'post'
            },
            description: [
                'This instance for signing in to APAPUN.COM',
            ]
        });
    Apapuncrafter.CrafterAuth = function (params, options, cb) {
        console.log(params.password, params.email, 'Params');
        const validate = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (validate.test(params.email)) {
            var datalogin = {
                email: params.email,
                password: params.password
            }
        } else {
            var datalogin = {
                username: params.email,
                password: params.password
            }
        }
        Apapuncrafter.login(datalogin, function (error, token) {
            console.log(token);
            if (error) {
                cb(error);
                console.log(error.statusCode, 'Errornya');
            } else {
                cb(error, token);
            }
        });
    };

    Apapuncrafter.remoteMethod(
        'CrafterSignOut', {
            accepts: [{
                arg: 'params',
                type: 'Object',
                required: true,
                http: { source: 'body' }
            }, {
                arg: "options",
                type: "object",
                http: "optionsFromRequest"
            }],
            returns: {
                arg: 'CrafterSignOut', type: 'array', root: true
            },
            http: {
                path: '/CrafterSignOut',
                verb: 'post'
            },
            description: [
                'This instance for signing out to APAPUN.COM',
            ]
        });

    Apapuncrafter.CrafterSignOut = function (params, options, cb) {
        console.log(params.password, params.email, 'Params');
        apapun_crafter.logout(params.token_id, function (error, data) {
            if (error) {
                cb(error);
                console.log(error.statusCode, 'Errornya');
            } else {
                cb(error, data);
            }
        });
    };

    Apapuncrafter.remoteMethod(
        'crafterEditProfile', {
            accepts: [{
                arg: 'params',
                type: 'ApapunCrafter',
                required: true,
                http: { source: 'body' }
            }, {
                arg: "options",
                type: "object",
                http: "optionsFromRequest"
            }],
            returns: {
                arg: 'crafterEditProfile', type: 'ApapunCrafter', root: true
            },
            http: {
                path: '/crafterEditProfile',
                verb: 'post'
            },
            description: [
                'This instance for User Authentication user APAPUN.COM',
            ]
        });
    Apapuncrafter.crafterEditProfile = function (params, options, cb) {
        Apapuncrafter.findById(params.id, function (err, data) {
            if (err) {
                // cb(err);
            } else {
                // cb(err, data);

                console.log(params, 'ParamsPhone');
                if (params.email === data.email) {
                    var x = 1;
                } else {
                    var x = 0;
                }

                console.log(params.phone, 'TELEPON')
                apapun_crafter.updateAll(
                    { id: params.id },
                    {
                        gender: params.gender,
                        birthDate: params.birth_date,
                        email: params.email,
                        noPhone: params.phone,
                        emailVerified: x,
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
};
