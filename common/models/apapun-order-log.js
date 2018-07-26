'use strict';

module.exports = function (Apapunorderlog) {

    let request = require("request");
    let app = require("../../server/server");

    Apapunorderlog.remoteMethod(
        'getLogOrder',{
            accepts: [{
                arg: 'params',
                type: 'ApapunOrderLog',
                required: true,
                http: { source: 'body' }
            }, {
                arg: "options",
                type: "object",
                http: "optionsFromRequest"
            }],
            returns: {
                arg: 'getLogOrder', type: 'ApapunOrderLog', root: true
            },
            http: {
                path: '/getLogOrder',
                verb: 'post'
            },
            description: [
                'This instance for User Authentication user APAPUN.COM',
            ]
        })
    Apapunorderlog.getLogOrder = function (params, options, cb) {
        Apapunorderlog.find({
            where : {orderId:params.orderId}
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

    Apapunorderlog.remoteMethod(
        'CreateStatusLog', {
            accepts: [{
                arg: 'params',
                type: 'ApapunOrderLog',
                required: true,
                http: { source: 'body' }
            }, {
                arg: "options",
                type: "object",
                http: "optionsFromRequest"
            }],
            returns: {
                arg: 'CreateStatusLog', type: 'ApapunOrderLog', root: true
            },
            http: {
                path: '/CreateStatusLog',
                verb: 'post'
            },
            description: [
                'This instance for User Authentication user APAPUN.COM',
            ]
        });

    Apapunorderlog.CreateStatusLog = function (params, options, cb) {
        console.log(params, 'Params');
        Apapunorderlog.create({
            description: params.description,
            orderId: params.orderId,
            status: params.status
        }, function (error, token) {
            console.log(token);
            if (error) {
                cb(error);
                console.log(error.statusCode, 'Errornya');
            } else {
                cb(error, token);
                let orderUpdateFinish = app.models.ApapunOrder;
                orderUpdateFinish.updateAll(
                    { orderId: params.orderId },
                    { status: 'finish' }
                ), function (error, data) {
                    cb(error, data);
                }
            }
        });
    }
};
