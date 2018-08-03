'use strict';

module.exports = function(Apapunreview) {
    let request = require("request");
    let app = require("../../server/server");

    Apapunreview.remoteMethod(
        'CreateReview', {
            accepts: [{
                arg: 'params',
                type: 'Apapunreview',
                required: true,
                http: { source: 'body' }
            }, {
                arg: "options",
                type: "object",
                http: "optionsFromRequest"
            }],
            returns: {
                arg: 'CreateReview', type: 'Apapunreview', root: true
            },
            http: {
                path: '/CreateReview',
                verb: 'post'
            },
            description: [
                'This instance for Crafter Edit Price user APAPUN.COM',
            ]
        });

        Apapunreview.CreateReview = function (params, options, cb) {
            console.log(params, 'Params');
            Apapunreview.create({
                orderId: params.orderId,
                description: params.description,
                title:params.title,
                rating:params.rating,
                crafterId:params.crafterId
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
    
    Apapunreview.remoteMethod(
            'getReviewByOrderId', {
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
                    arg: 'getReviewByOrderId', type: 'object', root: true
                },
                http: {
                    path: '/getReviewByOrderId',
                    verb: 'post'
                },
                description: [
                    'This instance for User Authentication user APAPUN.COM',
                ]
            });
        Apapunreview.getReviewByOrderId = function (params, options, cb, next) {
            console.log(params, 'Params Nya');
            Apapunreview.find(
                {
                    where : {orderId:params.orderId}
                }, function (error, result) {
                if (error) {
                    cb(error);
                    console.log(error.statusCode, 'Errornya');
                } else {
                    cb(error,result);
                }
            });
        };
    
        Apapunreview.remoteMethod(
                'getReviewByCrafterId', {
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
                        arg: 'getReviewByCrafterId', type: 'object', root: true
                    },
                    http: {
                        path: '/getReviewByCrafterId',
                        verb: 'post'
                    },
                    description: [
                        'This instance for User Authentication user APAPUN.COM',
                    ]
                });
            Apapunreview.getReviewByCrafterId = function (params, options, cb, next) {
                console.log(params, 'Params Nya');
                Apapunreview.find(
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
    
};
