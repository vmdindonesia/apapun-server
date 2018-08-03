'use strict';

module.exports = function (Apapunchat) {
    let request = require('request');
    let app = require('../../server/server');
    // let io = require('socket.io');

    Apapunchat.observe('after save', function (ctx, next) {
        console.log('Chat', ctx.instance);

        let userAuth = app.models.ApapunUsers;

        Apapunchat.on('connection', function(socket){
            Apapunchat.emit('broadcast', ctx.instance); // emit an event to all connected sockets
        });

        userAuth.find({
            where:
                { id: ctx.instance.fromId }
        }, function (err, result) {
            console.log(result, 'Data Personal');
            if (result) {
                let dataFilter = [];
                dataFilter.push({
                    'field': 'tag',
                    'key': 'id',
                    'relation': '=',
                    'value': ctx.instance.id
                });
                console.log(ctx.instance.fromId, 'ID TOT')
                console.log(dataFilter, 'dataFilter');

                let data = {
                    fromid: ctx.instance.fromId
                }
                console.log(data, 'Data');

                let content = result[0].realm + ' ' + 'send you a message';
                console.log(content, 'ISI NOTIF');
                sendMessage(dataFilter, content, data);
            }
        })
        next();
    });


    var sendMessage = function (device, message, data) {

        var restKey = 'YTUxN2E3YTEtNWZiYS00NjhhLThmZTctZGNkMWRlYzE2YWQz';
        var appID = '30bdea8d-4ed0-4df2-8fcf-fc60cbe9893d';
        request(
            {
                method: 'POST',
                uri: 'https://onesignal.com/api/v1/notifications',
                headers: {
                    'authorization': 'Basic ' + restKey,
                    'content-type': 'application/json'
                },
                json: true,
                body: {
                    'app_id': appID,
                    'filters': device,
                    'data': data,
                    'contents': { en: message }
                }
            },
            function (error, response, body) {
                try {
                    if (!body.errors) {
                        console.log(body);
                    } else {
                        console.error('Error:', body.errors);
                    }
                } catch (err) {
                    console.log(err);
                }

            }
        )
    }

};
