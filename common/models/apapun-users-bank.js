'use strict';

module.exports = function(Apapunusersbank) {
    let request = require("request");
    let app = require("../../server/server");
    Apapunusersbank.remoteMethod(
        'CreateAccountBank', {
            accepts: [{
                arg: 'params',
                type: 'ApapunUsersBank',
                required: true,
                http: { source: 'body' }
            }, {
                arg: "options",
                type: "object",
                http: "optionsFromRequest"
            }],
            returns: {
                arg: 'CreateAccountBank', type: 'ApapunUsersBank', root: true
            },
            http: {
                path: '/CreateAccountBank',
                verb: 'post'
            },
            description: [
                'This instance for User Authentication user APAPUN.COM',
            ]
        });
    Apapunusersbank.CreateAccountBank = function (params, options, cb, next) {
        var ds = Apapunusersbank.dataSource;
        const sqlRow = "Select * FROM apapun_crafter";

        ds.connector.query(sqlRow, function (err, data) {
            if (err) {
                console.log(err, 'ERROR QUERY USER ID');
            } else {
                var crafterId = data[0].crafter_id;
                let verification = app.models.ApapunVerification;
                var dataPost = {
                    crafterId: crafterId, 
                    rekeningUrl: params.rekeningUrl, 
                    ktpUrl: params.ktpUrl, 
                    fotoUrl: params.fotoUrl, 
                    bankName: params.bankName, 
                    accountHolderName: params.accountHolderName, 
                    accountHolderNumber: params.accountHolderNumber, 
                    bankBranch: params.bankBranch, 
                    userId: params.userId
                }
                if(!params.code){
                    cb(null,{"response":"Verification Code Tidak Ditemukan"});
                    return;
                }
                verification.find({
                    where: {
                        or: [
                            { and: [{ code: params.code }, { description: "add_bank" }] }
                        ]
                    }
                }, function (err, result) {
                    console.log(result, "PARAMETER WHERE")
                    if (result.length>0) {
                        Apapunusersbank.create(dataPost, function (error, result) {
                            if (error) {
                                cb(error);
                                console.log(error.statusCode, 'Errornya');
                            } else {
                                cb(null,result);
                            }
                        });
                    }else{
                        cb(null,{"response":"Verification Code Tidak Ditemukan"})
                    }
                });
            }
        });
        // console.log(params, 'Params Nya');
        // let verification = app.models.ApapunVerification;
        // verification.find({
        //     where: {
        //         or: [
        //             { and: [{ code: params.code }, { description: "add_bank" }] }
        //         ]
        //     }
        // }, function (err, result) {
        //     console.log(result, "PARAMETER WHERE")
        //     if (result.length>0) {
        //         Apapunusersbank.create(params, function (error, result) {
        //             if (error) {
        //                 cb(error);
        //                 console.log(error.statusCode, 'Errornya');
        //             } else {
        //                 cb(null,result);
        //             }
        //         });
        //     }else{
        //         cb(null,{"response":"Verification Code Tidak Ditemukan"})
        //     }
        // });
    };

    Apapunusersbank.remoteMethod(
        'getUserBankById', {
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
                arg: 'getUserBankById', type: 'object', root: true
            },
            http: {
                path: '/getUserBankById',
                verb: 'post'
            },
            description: [
                'This instance for User Authentication user APAPUN.COM',
            ]
        });
    Apapunusersbank.getUserBankById = function (params, options, cb, next) {
        console.log(params, 'Params Nya');
        Apapunusersbank.find(
            {
                where : {crafterId:params.crafterId},
                include: [{
                    relation: 'ApapunUsers'
                }]
            }, function (error, result) {
            if (error) {
                cb(error);
                console.log(error.statusCode, 'Errornya');
            } else {
                var myarr = result[0].accountHolderName.split(" ");
                var response = {
                    "crafterId" : result[0].crafterId,
                    "updatedAt" : result[0].updatedAt,
                    "rekeningUrl" : result[0].rekeningUrl,
                    "ktpUrl" : result[0].ktpUrl,
                    "fotoUrl" : result[0].fotoUrl,
                    "bankName" : result[0].bankName,
                    "accountHolderName" : result[0].accountHolderName,
                    "accountHolderNumber" : result[0].accountHolderNumber,
                    "bankBranch" : result[0].bankBranch,
                    "userId" : result[0].userId,
                    "nama_depan" : myarr[0],
                    "nama_belakang" : myarr[1],
                }
                cb(error,response);
            }
        });
    };

    Apapunusersbank.remoteMethod(
        'updateUserBank', {
            accepts: [{
                arg: 'params',
                type: 'ApapunUsersBank',
                required: true,
                http: { source: 'body' }
            }, {
                arg: "options",
                type: "object",
                http: "optionsFromRequest"
            }],
            returns: {
                arg: 'updateUserBank', type: 'ApapunUsersBank', root: true
            },
            http: {
                path: '/updateUserBank',
                verb: 'post'
            },
            description: [
                'This instance for User Authentication user APAPUN.COM',
            ]
        });
    Apapunusersbank.updateUserBank = function (params, options, cb) {
        Apapunusersbank.find({userId:params.userId, crafterId:params.crafterId}, function (err, data) {
            if (err) {
                cb(err);
            } else {
                Apapunusersbank.updateAll(
                    { userId:params.userId,crafterId: params.crafterId },
                    {
                        rekeningUrl:params.rekeningUrl,
                        ktpUrl:params.ktpUrl,
                        fotoUrl:params.fotoUrl,
                        bankName:params.bankName,
                        accountHolderName:params.accountHolderName,
                        accountHolderNumber:params.accountHolderNumber,
                        bankBranch:params.bankBranch
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
