'use strict';

module.exports = function (Apapunusers) {
    let request = require("request");
    let app = require("../../server/server");

    Apapunusers.remoteMethod(
        'UserRegister', {
            accepts: [{
                arg: 'params',
                type: 'ApapunUsers',
                required: true,
                http: { source: 'body' }
            }, {
                arg: "options",
                type: "object",
                http: "optionsFromRequest"
            }],
            returns: {
                arg: 'UserRegister', type: 'ApapunUsers', root: true
            },
            http: {
                path: '/UserRegister',
                verb: 'post'
            },
            description: [
                'This instance for User Authentication user APAPUN.COM',
            ]
        });
    Apapunusers.UserRegister = function (params, options, cb) {
        console.log(params, 'Params');
        Apapunusers.create(params, function (error, token) {
            console.log(token, "TOKEN");
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
                    addressOwner: params.realm,
                    addressDefault: "1",
                    userId: token.id
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

    Apapunusers.remoteMethod(
        'UserAuth', {
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
                arg: 'UserAuth', type: 'array', root: true
            },
            http: {
                path: '/UserAuth',
                verb: 'post'
            },
            description: [
                'This instance for signing in to APAPUN.COM',
            ]
        });
    Apapunusers.UserAuth = function (params, options, cb) {
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
            // console.log(token);
            if (error) {
                cb(error);
                console.log(error.statusCode, 'Errornya');
            } else {
                cb(error, token);
            }
        });
    };

    Apapunusers.remoteMethod(
        'UserSignOut', {
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
                arg: 'UserSignOut', type: 'array', root: true
            },
            http: {
                path: '/UserSignOut',
                verb: 'post'
            },
            description: [
                'This instance for signing out to APAPUN.COM',
            ]
        });

    Apapunusers.UserSignOut = function (params, options, cb) {
        console.log(params.password, params.email, 'Params');
        Apapunusers.logout(params.token_id, function (error, data) {
            if (error) {
                cb(error);
                console.log(error.statusCode, 'Errornya');
            } else {
                cb(error, data);
            }
        });
    };

    Apapunusers.remoteMethod(
        'EditProfile', {
            accepts: [{
                arg: 'params',
                type: 'ApapunUsers',
                required: true,
                http: { source: 'body' }
            }, {
                arg: "options",
                type: "object",
                http: "optionsFromRequest"
            }],
            returns: {
                arg: 'EditProfile', type: 'ApapunUsers', root: true
            },
            http: {
                path: '/EditProfile',
                verb: 'post'
            },
            description: [
                'This instance for User Authentication user APAPUN.COM',
            ]
        });
    Apapunusers.EditProfile = function (params, options, cb) {
        Apapunusers.findById(params.id, function (err, data) {
            if (err) {
                cb(err);
            } else {
                console.log(params, 'ParamsPhone');
                if (params.email === data.email) {
                    var x = 1;
                } else {
                    var x = 0;
                }

                console.log(params.phone, 'TELEPON')
                Apapunusers.updateAll(
                    { id: params.id },
                    {
                        gender: params.gender,
                        birthDate: params.birthDate,
                        email: params.email,
                        noPhone: params.noPhone
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

    Apapunusers.remoteMethod(
        'ResetPassword', {
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
                arg: 'ResetPassword', type: 'array', root: true
            },
            http: {
                path: '/ResetPassword',
                verb: 'post'
            },
            description: [
                'This instance for reset password in to APAPUN.COM',
            ]
        });
    Apapunusers.ResetPassword = function (params, options, cb) {
        console.log(params, "PARAMETER")
        let verification = app.models.ApapunVerification;
        verification.find({
            where: {
                code: params.code
            }
        }, function (err, result) {
            console.log(result, "PARAMETER WHERE")
            if (result.length > 0) {
                if (params.email === result[0].email) {
                    Apapunusers.findById(params.idUser, function (err, user) {
                        if (err) {
                            return cb(err);
                        }
                        var updateAttr = {
                            'password': params.password
                        };

                        user.updateAttributes(updateAttr, function (err, user) {
                            if (err) {
                                return cb({ "response": "Terjadi Kesalahan Sistem" });
                            }
                            if (user) {
                                cb({ message: 'Password Berhasil Diupdate' });
                            }
                        });
                    });
                } else {
                    cb({ "response": "Email Tidak Sesuai" });
                }
            } else {
                cb({ "response": "Verification Code Tidak Sesuai" });
            }
        });
    };
};
