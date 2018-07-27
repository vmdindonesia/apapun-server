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
        console.log(params, 'Params Nya');
        Apapunusersbank.create(params, function (error, result) {
            if (error) {
                cb(error);
                console.log(error.statusCode, 'Errornya');
            } else {
                cb(error,result);
            }
        });
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
                where : {crafterId:params.crafterId}
            }, function (error, result) {
            if (error) {
                cb(error);
                console.log(error.statusCode, 'Errornya');
            } else {
                cb(error,result);
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
