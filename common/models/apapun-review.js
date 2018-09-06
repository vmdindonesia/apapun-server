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
            var ds = Apapunreview.dataSource;
            const sqlRow = " SELECT a.*, c.realm, c.profile_url FROM `apapun_review` as a"
                         + " LEFT JOIN apapun_order as b on b.order_id = a.order_id"
                         + " LEFT JOIN apapun_users as c on c.id = b.id_user"
                         + " WHERE a.crafter_id = '"+params.crafterId+"'";
            ds.connector.query(sqlRow, function (err, data) {
                if (err) {
                    console.log(err, 'ERROR QUERY USER ID');
                } else {
                    cb(err,data);
                }
            });
        };

        Apapunreview.remoteMethod(
            'getTotalReviewByCrafterId', {
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
                    arg: 'getTotalReviewByCrafterId', type: 'object', root: true
                },
                http: {
                    path: '/getTotalReviewByCrafterId',
                    verb: 'post'
                },
                description: [
                    'This instance for User Authentication user APAPUN.COM',
                ]
            });
        Apapunreview.getTotalReviewByCrafterId = function (params, options, cb, next) {
            console.log(params, 'Params Nya');
            var ds = Apapunreview.dataSource;
            const sqlRow = " SELECT a.*, b.total FROM `apapun_rating` as a "
                         + " LEFT OUTER JOIN (SELECT count(id) as total, rating "
                         + " FROM apapun_review WHERE crafter_id = '"+params.crafterId+"' "
                         + " GROUP BY rating) as b on b.rating = a.rating"
                         + " GROUP BY a.rating ORDER BY a.rating";
            ds.connector.query(sqlRow, function (err, data) {
                if (err) {
                    console.log(err, 'ERROR QUERY USER ID');
                } else {
                    cb(null,data );
                }
            });
        };

        Apapunreview.remoteMethod(
            'getHighlightReviewByCrafterId', {
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
                    arg: 'getHighlightReviewByCrafterId', type: 'object', root: true
                },
                http: {
                    path: '/getHighlightReviewByCrafterId',
                    verb: 'post'
                },
                description: [
                    'This instance for User Authentication user APAPUN.COM',
                ]
            });
        Apapunreview.getHighlightReviewByCrafterId = function (params, options, cb, next) {
            console.log(params, 'Params Nya');
            Apapunreview.find(
                {
                    where : {crafterId:params.crafterId}
                }, function (error, result) {
                if (error) {
                    cb(error);
                    console.log(error.statusCode, 'Errornya');
                } else {
                    var jmlreview = result.length;
                    var rating = 0;
                    for(var i=0;i<result.length;i++){
                        rating = parseInt(rating)+parseInt(result[i].rating);
                    }
                    console.log(jmlreview,"jml");
                    console.log(rating,"rating");
                    console.log(rating/jmlreview,"Total Rating");
                    var totalRating = parseInt(rating)/parseInt(jmlreview);
                    var description = "-";
                    if(totalRating <= 1){
                        description = "Buruk";
                    }
                    if(totalRating >= 2 && totalRating<3){
                        description = "Cukup";
                    }
                    if(totalRating >= 3 && totalRating<4){
                        description = "Bagus";
                    }
                    if(totalRating == 4){
                        description = "Sempurna";
                    }
                    var response = {
                        "jmlReview" : jmlreview,
                        "totalRating" : rating/jmlreview,
                        "description" :description
                    }
                    cb(error,response);
                }
            });
        };
    
};
