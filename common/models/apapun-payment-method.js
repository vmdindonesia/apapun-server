'use strict';

module.exports = function(Apapunpaymentmethod) {
    let request = require("request");
    let app = require("../../server/server");

    Apapunpaymentmethod.remoteMethod(
        'createPayment', {
            accepts: [{
                arg: 'params',
                type: 'Apapunpaymentmethod',
                required: true,
                http: { source: 'body' }
            }, {
                arg: "options",
                type: "object",
                http: "optionsFromRequest"
            }],
            returns: {
                arg: 'createPayment', type: 'Apapunpaymentmethod', root: true
            },
            http: {
                path: '/createPayment',
                verb: 'post'
            },
            description: [
                'This instance for User Authentication user APAPUN.COM',
            ]
        });

        Apapunpaymentmethod.createPayment = function (params, options, cb) {
            console.log(params, 'Params');
            Apapunpaymentmethod.create({
                orderId: params.orderId,
                userId: params.userId,
                noRek: params.noRek,
                viaBank: params.viaBank,
                status: params.status,
                nominal: params.nominal,
                received: params.received,
                viaTransfer: params.viaTransfer
            }, function (error, token) {
                console.log(token);
                if (error) {
                    cb(error);
                    console.log(error.statusCode, 'Errornya');
                } else {
                    cb(error, token);
                }
            });
        };

        Apapunpaymentmethod.remoteMethod(
            'editPayment', {
                accepts: [{
                    arg: 'params',
                    type: 'Apapunpaymentmethod',
                    required: true,
                    http: { source: 'body' }
                }, {
                    arg: "options",
                    type: "object",
                    http: "optionsFromRequest"
                }],
                returns: {
                    arg: 'editPayment', type: 'Apapunpaymentmethod', root: true
                },
                http: {
                    path: '/editPayment',
                    verb: 'post'
                },
                description: [
                    'This instance for User Authentication user APAPUN.COM',
                ]
            });

            Apapunpaymentmethod.ResetPassword = function (params, options, cb) {
                console.log(params,"PARAMETER")
                let verification = app.models.ApapunVerification;
                verification.find({
                    where: {
                        code:params.code
                    }
                }, function(err, result) {
                    console.log(result,"PARAMETER WHERE")
                    if(result.length > 0){
                        if(params.email === result[0].email){
                            Apapunpaymentmethod.findById(params.idUser, function(err, user) {
                                if (err){
                                    return cb(err);
                                }
                                var updateAttr = {
                                    'password': params.password
                                };
                    
                                user.updateAttributes(updateAttr, function(err, user) {
                                    if(err){
                                        return cb({"response":"Terjadi Kesalahan Sistem"});
                                    }
                                    if(user){
                                        cb({message: 'Password Berhasil Diupdate'});
                                    }
                                });
                             });
                        }else{
                            cb({"response":"Email Tidak Sesuai"});
                        }
                    }else{
                        cb({"response":"Verification Code Tidak Sesuai"});
                    }
                });
            };
};
