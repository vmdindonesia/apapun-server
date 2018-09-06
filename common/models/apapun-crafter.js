'use strict';

module.exports = function (Apapuncrafter) {
    let request = require("request");
    let app = require("../../server/server");

    Apapuncrafter.remoteMethod(
        'getTotalCrafter', {
            accepts: [{
                arg: 'params',
                type: 'object',
                required: false,
                http: { source: 'body' }
            }, {
                arg: "options",
                type: "object",
                http: "optionsFromRequest"
            }],
            returns: {
                arg: 'getTotalCrafter', type: 'object', root: true
            },
            http: {
                path: '/getTotalCrafter',
                verb: 'get'
            },
            description: [
                'This instance for User Authentication user APAPUN.COM',
            ]
        });
    Apapuncrafter.getTotalCrafter = function (params, options, cb) {
        var ds = Apapuncrafter.dataSource;
        const sqlRow = " SELECT a.*, count(b.crafter_id) as jml_crafter "
                     + " FROM apapun_kategori as a"
                     + " LEFT JOIN apapun_crafter_category as b on b.crafter_kategori = a.id"
                     + " GROUP BY a.id";
        ds.connector.query(sqlRow, function (err, data) {
            if (err) {
                console.log(err, 'ERROR QUERY USER ID');
            } else {
                cb(err,data);
            }
        });
    };

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
        var ds = Apapuncrafter.dataSource;
        const sqlRow = "Select * FROM apapun_crafter";

        ds.connector.query(sqlRow, function (err, data) {
            if (err) {
                console.log(err, 'ERROR QUERY USER ID');
            } else {
                console.log(data.length, 'Data Query Manual');
                const ai = data.length + 1;
                var dataparams = {
                    crafterId: 'CRAFTER-' + ai,
                    idUser: params.idUser,
                    craftername: params.craftername,
                    selfDeliveryService: params.selfDeliveryService,
                    subject: params.subject,
                    review: params.review,
                    profileImage: params.profileImage,
                    categoryId : params.categoryId
                }                
                Apapuncrafter.create(dataparams, function (error, token) {
                    console.log(token);
                    if (error) {
                        console.log(error, 'Errornya');
                    } else {                       
                        let crafterCategoryModel = app.models.ApapunCrafterCategory;
                        for (var i = 0; i < dataparams.categoryId.length; i++) {
                            console.log(token.categoryId[i], 'ID ORDER');
                            crafterCategoryModel.create({
                                crafterKategori: dataparams.categoryId[i],
                                crafterId: token.crafterId
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
        var ds = Apapuncrafter.dataSource;
        const sql = " SELECT a.*, c.`name` as province_name, d.`name` as city, "
                  + " e.`name` as disctict_name"
                  + " FROM `apapun_crafter` as a"
                  + " LEFT JOIN apapun_users_address as b on b.userId = a.id_user"
                  + " LEFT JOIN apapun_provinces as c on c.id = b.province"
                  + " LEFT JOIN apapun_regencies as d on d.id = b.city"
                  + " LEFT JOIN apapun_districts as e on e.id = b.district "
                  + " WHERE a.id_user = '"+params.userId+"'";
        ds.connector.execute(sql, function (err, result) {
            if (err) {
                cb(err);
                return;
            }

            var crafterData = result;

            console.log(result,"data crafter");

            let crafterCategoryModel = app.models.ApapunCrafterCategory;
            crafterCategoryModel.find({
                where: {crafterId : result[0].crafter_id}
            },function(err,category){
                if (err) {
                    cb(err);
                    return;
                }

                var response = {
                    crafterData,category
                }

                cb(null, response);
            })
        });
        // Apapuncrafter.find({
        //     where: { crafterId: params.crafterId }
        // }, function (err, result) {
        //     console.log(result, "kategori crafter");
        //     if (result) {
        //         cb(err, result);
        //     }
        // });
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
        Apapuncrafter.findById(params.crafterId, function (err, data) {
            if (err) {
                cb(err);
            } else {
                Apapuncrafter.updateAll(
                    { crafterId: params.crafterId },
                    {
                        craftername: params.craftername,
                        selfDeliveryService: params.selfDeliveryService,
                        email: params.email,
                        phone: params.phone,
                        profileImage:params.profileImage,
                        biodata : params.biodata
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
