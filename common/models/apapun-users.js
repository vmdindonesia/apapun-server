'use strict';

module.exports = function (Apapunusers) {
    let request = require("request");
    let app = require("../../server/server");

    Apapunusers.remoteMethod(
        'getUserProfile', {
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
                arg: 'getUserProfile', type: 'object', root: true
            },
            http: {
                path: '/getUserProfile',
                verb: 'post'
            },
            description: [
                'This instance for User Authentication user APAPUN.COM',
            ]
        });
    Apapunusers.getUserProfile = function (params, options, cb) {
        var ds = Apapunusers.dataSource;
        const sqlRow = " SELECT a.id, a.realm, a.profile_url, a.email, a.phone, a.birth_date, a.gender,a.username,"
                     + " b.address_txt, c.`name` as province, d.`name` as city, e.`name` as district"
                     + " FROM `apapun_users` as a"
                     + " LEFT JOIN apapun_users_address as b on b.userId = a.id"
                     + " LEFT JOIN apapun_provinces as c on c.id = b.province"
                     + " LEFT JOIN apapun_regencies as d on d.id = b.city"
                     + " LEFT JOIN apapun_districts as e on e.id = b.district"
                     + " WHERE a.id = '"+params.userId+"'";
        ds.connector.query(sqlRow, function (err, data) {
            if (err) {
                console.log(err, 'ERROR QUERY USER ID');
            } else {
                if(data[0].gender == "male"){
                    var gender = "Laki-Laki";
                }
                if(data[0].gender == "female"){
                    var gender = "Perempuan";
                }
                var data = {
                    "id" : data[0].id,
                    "realm" : data[0].realm,
                    "email" : data[0].email,
                    "phone" : data[0].phone,
                    "birth_date" : data[0].birth_date,
                    "address_txt" : data[0].address_txt,
                    "province" : data[0].province,
                    "city" : data[0].city,
                    "district" : data[0].district,
                    "profile_url" : data[0].profile_url,
                    "gender" : gender,
                    "username" :data[0].username
                }
                cb(err,data);
            }
        });
    };

    Apapunusers.remoteMethod(
        'getHighlightUser', {
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
                arg: 'getHighlightUser', type: 'object', root: true
            },
            http: {
                path: '/getHighlightUser',
                verb: 'post'
            },
            description: [
                'This instance for User Authentication user APAPUN.COM',
            ]
        });
    Apapunusers.getHighlightUser = function (params, options, cb) {
        var ds = Apapunusers.dataSource;
        const sqlRow = " SELECT a.profile_url as user_profile, a.realm as user_name, "
                     + " count(b.order_id) as jml_desain, sum(c.price) as total_apresiasi, "
                     + " e.craftername, e.profile_image, count(f.order_id) as total_pesanan, "
                     + " sum(f.price) as total_pemasukan"
                     + " FROM `apapun_users` as a"
                     + " LEFT JOIN `apapun_order` as b on b.id_user = a.id"
                     + " LEFT JOIN apapun_order_idea as d on d.order_id = b.order_id "
                     + " LEFT JOIN apapun_apresiasi as c on c.order_id = d.order_id "
                     + " LEFT JOIN apapun_crafter as e on e.id_user = a.id"
                     + " LEFT JOIN apapun_bet as f on f.crafter_id = e.crafter_id"
                     + " WHERE a.id = "+params.userId+"";
        ds.connector.query(sqlRow, function (err, data) {
            if (err) {
                console.log(err, 'ERROR QUERY USER ID');
            } else {
                var response = [
                    {                        
                        "user_image":data[0].user_profile,
                        "user_name":data[0].user_name,
                        "user_jml_desain":data[0].jml_desain,
                        "user_total_apresiasi":data[0].total_apresiasi
                    },                    
                    {
                        "crafter_image":data[0].profile_image,
                        "crafter_name":data[0].craftername,
                        "crafter_jml_pesanan":data[0].total_pesanan,
                        "crafter_jml_pemasukan":data[0].total_pemasukan
                    }
                ];
                cb(err,response);
            }
        });
    };

    Apapunusers.remoteMethod(
        'getHighlighProductUser', {
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
                arg: 'getHighlighProductUser', type: 'object', root: true
            },
            http: {
                path: '/getHighlighProductUser',
                verb: 'post'
            },
            description: [
                'This instance for User Authentication user APAPUN.COM',
            ]
        });
    Apapunusers.getHighlighProductUser = function (params, options, cb) {
        var ds = Apapunusers.dataSource;
        const sqlRow = " SELECT a.order_id, b.`name` FROM apapun_order as a "
                     + " LEFT JOIN apapun_images as b on b.id_order = a.order_id"
                     + " WHERE a.id_user = '"+params.userId+"' "
                     + " GROUP BY a.order_id";
        ds.connector.query(sqlRow, function (err, data) {
            if (err) {
                console.log(err, 'ERROR QUERY USER ID');
            } else {
                cb(err,data);
            }
        });
    };

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
        var ds = Apapunusers.dataSource;
        const sqlRow = " SELECT * FROM apapun_users WHERE email = '"+params.email+"'";
        ds.connector.query(sqlRow, function (err, data) {
            if(data.length > 0){
                cb(null,{"response":"Email was registered"});
                return;
            }else{
                const sqlRow2 = " SELECT * FROM apapun_users WHERE username = '"+params.username+"'";
                ds.connector.query(sqlRow2, function (err, data) {
                    if(data.length > 0){
                        cb(null,{"response":"Username  was registered"});
                        return;
                    }else{                        
                        Apapunusers.create(params, function (error, token) {
                            console.log(token, "TOKEN");
                            if (error) {
                                console.log(error, 'Errornya');
                            } else {
                                let addressModel = app.models.ApapunUsersAddress;
                                addressModel.create({
                                    username: params.username,
                                    addressTxt: params.addressTxt,
                                    city: params.idCity,
                                    province: params.idProvince,
                                    district: params.idDistrict,
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
            // var crafterId = '';
            if (error) {
                cb(error);
                console.log(error.statusCode, 'Errornya');
            } else {
                console.log(token, "token");
                let ModelCrafter = app.models.ApapunCrafter;
                var crafterId = '';
                ModelCrafter.find({
                    where: { idUser: token.userId }
                }, function (err, result) {
                    console.log(result);
                    if (err) {
                        console.log(err, 'Error Login');
                        cb(err)
                    } else {
                        if (result.length > 0) {
                            crafterId = result[0].crafterId;
                        }

                        let datalogin = {
                            "userId": token.userId,
                            "ttl": token.ttl,
                            "id": token.id,
                            "created": token.created,
                            "crafterId": crafterId
                        }

                        cb(null, datalogin);
                    }
                });
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
                where: {
                    or: [
                        { and: [{ code: params.code }, { description: "forgot_password" }] }
                    ]
                }
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
