'use strict';

module.exports = function (Apapuncrafter) {
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
                let crafterCategoryModel = app.models.ApapunCrafterCategory;
                for (var i = 0; i < params.categoryId.length; i++) {
                    console.log(token.categoryId[i], 'ID ORDER');
                    crafterCategoryModel.create({
                        crafterKategori: params.categoryId[i],
                        crafterId: params.crafterId
                    }, function (err, data) {
                        if (err) {
                            console.log(err)
                        }
                    });
                }
                console.log(token);
                cb(error, token);
            }
        });
    };

    Apapuncrafter.remoteMethod('getCrafterbyKategori', {
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
            arg: 'getCrafterbyKategori', type: 'ApapunCrafter', root: true
        },
        http: {
            path: '/getCrafterbyKategori',
            verb: 'post'
        },
        description: [
            'This instance for User Authentication user APAPUN.COM',
        ]
    });

    Apapuncrafter.getCrafterbyKategori = function (params, options, cb) {
        console.log(params, 'Params')
        let crafterCategoryModel = app.models.ApapunCrafterCategory;
        crafterCategoryModel.find({
            where: { crafterKategori: params.kategoriId },
            include: {
                relation: 'ApapunCrafter', // include the owner object
                scope: { // further filter the owner object
                    // where: { crafterId: params.crafterId },
                    fields: ['crafterId', 'craftername', "profileImage"], // only show two fields
                }
            }
        }, function (err, result) {
            console.log(result, "kategori crafter");
            if (result) {
                cb(err, result);
            }
        });
    };


    Apapuncrafter.remoteMethod('getCrafterbyId', {
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
            arg: 'getCrafterbyId', type: 'ApapunCrafter', root: true
        },
        http: {
            path: '/getCrafterbyId',
            verb: 'post'
        },
        description: [
            'This instance for User Authentication user APAPUN.COM',
        ]
    });

    Apapuncrafter.getCrafterbyId = function (params, options, cb) {
        Apapuncrafter.find({
            where: { idUser: params.idUser }
        }, function (err, result) {
            console.log(result, "kategori crafter");
            if (result) {
                cb(err, result);
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
        Apapuncrafter.logout(params.token_id, function (error, data) {
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

    Apapuncrafter.remoteMethod('getCrafter', {
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
            arg: 'getCrafter', type: 'ApapunCrafter', root: true
        },
        http: {
            path: '/getCrafter',
            verb: 'post'
        },
        description: [
            'This instance for User Authentication user APAPUN.COM',
        ]
    });

    Apapuncrafter.getCrafter = function (params, options, cb) {
        console.log(params, 'Parameter User Id');
        Apapuncrafter.find({
            where:
                { idUser: params.idUser }
        }, function (err, result) {
            if (err) {
                console.log(err);
                cb(err);
            } else {
                let CrafterCategory = app.models.ApapunCrafterCategory;
                CrafterCategory.find({
                    where:
                        { crafterId: result[0].crafterId }
                }, function (err, resultCategory) {
                    if (err) {
                        console.log(err);
                        cb(err)
                    } else {
                        console.log(resultCategory);
                        cb(err, resultCategory);
                    }
                });
            }
        });
    };
};
