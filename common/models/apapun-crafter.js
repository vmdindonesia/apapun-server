'use strict';

module.exports = function(apapun_crafter) {
    let request = require("request");
    let app = require("../../server/server");

    apapun_crafter.remoteMethod(
        'CrafeRegister', {
            accepts: [{
                arg: 'params',
                type: 'apapun_crafter',
                required: true,
                http: { source: 'body' }
            }, {
                arg: "options",
                type: "object",
                http: "optionsFromRequest"
            }],
            returns: {
                arg: 'CrafterRegister', type: 'apapun_crafter', root: true
            },
            http: {
                path: '/apapun_crafter',
                verb: 'post'
            },
            description: [
                'This instance for User Authentication user APAPUN.COM',
            ]
        });
    apapun_crafter.modem = function (params, options, cb) {
        console.log(params, 'Params');
        apapun_crafter.create(params, function (error, token) {
            console.log(token);
            if (error) {
                console.log(error, 'Errornya');
            } else {
                let addressModel = app.models.ApapunUsersAddress;
                addressModel.create({
                    username: params.username,
                    addressTxt: params.addressTxt,
                    city: params.city,
                    province: params.province,
                    district: params.district,
                    location: params.location,
                    type: "Home",
                    addressOwner:params.realm,
                    addressDefault:"1"
                }, function (error, token) {
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

    apapun_crafter.remoteMethod(
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
                path: '/UserAuth',
                verb: 'post'
            },
            description: [
                'This instance for signing in to APAPUN.COM',
            ]
        });
    apapun_crafter.CrafterAuth = function (params, options, cb) {
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
        Apapunusers.login(datalogin, function (error, token) {
            console.log(token);
            if (error) {
                cb(error);
                console.log(error.statusCode, 'Errornya');
            } else {
                cb(error, token);
            }
        });
    };

    apapun_crafter.remoteMethod(
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
                path: '/Crafter SignOut',
                verb: 'post'
            },
            description: [
                'This instance for signing out to APAPUN.COM',
            ]
        });

    apapun_crafter.CrafterSignOut = function (params, options, cb) {
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

    apapun_crafter.remoteMethod(
        'crafter_EditProfile', {
            accepts: [{
                arg: 'params',
                type: 'apapun_crafter',
                required: true,
                http: { source: 'body' }
            }, {
                arg: "options",
                type: "object",
                http: "optionsFromRequest"
            }],
            returns: {
                arg: 'cust_EditProfile', type: 'apapun_crafter', root: true
            },
            http: {
                path: '/EditProfile',
                verb: 'post'
            },
            description: [
                'This instance for User Authentication user APAPUN.COM',
            ]
        });
    apapun_crafter.approve_EditProfile = function (params, options, cb) {
        apapun_crafter.findById(params.id, function (err, data) {
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
