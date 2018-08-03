'use strict';

module.exports = function(Apapunusersaddress) {

    Apapunusersaddress.remoteMethod(
        'AddNewAddress', {
            accepts: [{
                arg: 'params',
                type: 'ApapunUsersAddress',
                required: true,
                http: { source: 'body' }
            }, {
                arg: "options",
                type: "object",
                http: "optionsFromRequest"
            }],
            returns: {
                arg: 'AddNewAddress', type: 'ApapunUsersAddress', root: true
            },
            http: {
                path: '/AddNewAddress',
                verb: 'post'
            },
            description: [
                'This instance for User Authentication user APAPUN.COM',
            ]
        });
    Apapunusersaddress.AddNewAddress = function (params, options, cb) {
        console.log(params, 'Params');
        Apapunusersaddress.create(
            {
                addressTxt: params.addressTxt,
                city: params.city,
                province: params.province,
                district: params.district,
                location: params.location,
                type: params.type,
                addressOwner:params.addressOwner,
                addressDefault:params.addressDefault,
                userId : params.userId
            }, function (error, token) {
                console.log(token, "TOKEN");
                if (error) {
                    console.log(error, 'Errornya');
                } else {
                    cb(error, token);
                }
            
        });
    };

    Apapunusersaddress.remoteMethod(
        'getUserAddress', {
            accepts: {
                arg: 'data',
                type: 'Object',
                http: { source: 'body' }
            },
            returns: {
                type: 'array', root: true
            },
            http: {
                path: '/getUserAddress',
                verb: 'post'
            }
        });

    Apapunusersaddress.getUserAddress = function (params, cb) {
        console.log(params, 'Params address')

        Apapunusersaddress.find({
            where:
                { userId: params.idUser }
        }, function (err, result) {
            if (result) {
                cb(err, result, 'Data Address');
            } else {
                console.log(error, 'Error');
                cb(err);
            }
        })
    };

    Apapunusersaddress.remoteMethod(
        'deleteUserAddress', {
            accepts: {
                arg: 'data',
                type: 'Object',
                http: { source: 'body' }
            },
            returns: {
                type: 'array', root: true
            },
            http: {
                path: '/deleteUserAddress',
                verb: 'post'
            }
        });

    Apapunusersaddress.deleteUserAddress = function (params, cb) {
        console.log(params, 'Params address')

        Apapunusersaddress.destroyById(params.addressId, function(err,result){
            if (result) {
                cb(err, result, 'Data Address');
            } else {
                cb(err);
            }
        });
    };

    Apapunusersaddress.remoteMethod(
        'EditUserAddress', {
            accepts: [{
                arg: 'params',
                type: 'ApapunUsersAddress',
                required: true,
                http: { source: 'body' }
            }, {
                arg: "options",
                type: "object",
                http: "optionsFromRequest"
            }],
            returns: {
                arg: 'EditUserAddress', type: 'ApapunUsersAddress', root: true
            },
            http: {
                path: '/EditUserAddress',
                verb: 'post'
            },
            description: [
                'This instance for User Authentication user APAPUN.COM',
            ]
        });
    Apapunusersaddress.EditUserAddress = function (params, options, cb) {
        Apapunusersaddress.findById(params.addressId, function (err, data) {
            if (err) {
                cb(err);
            } else {
                Apapunusersaddress.updateAll(
                    { addressId: params.addressId },
                    {
                        addressTxt: params.addressTxt,
                        city: params.city,
                        province: params.province,
                        district: params.district,
                        location: params.location,
                        type: params.type,
                        addressOwner:params.addressOwner,
                        addressDefault:params.addressDefault,
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
