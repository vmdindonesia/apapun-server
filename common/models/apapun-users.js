'use strict';

module.exports = function (Apapunusers) {
    let request = require("request");
    let app = require("../../server/server");
    const nodemailer = require('nodemailer');
    var handlebars = require('handlebars');
    var fs = require('fs');

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
        Apapunusers.create(params, function (error, token) {
            console.log(token, "TOKEN");
            if (error) {
                console.log(error, 'Errornya');
            } else {
                let addressModel = app.models.ApapunUsersAddress;
                addressModel.create({
                    username: params.username,
                    addressTxt: params.addressTxt,
                    city: params.city,
                    province: params.province,
                    district: params.district,
                    location: params.location,
                    type: "Home",
                    addressOwner:params.realm,
                    addressDefault:"1",
                    userId : token.id
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
            console.log(token);
            if (error) {
                cb(error);
                console.log(error.statusCode, 'Errornya');
            } else {
                cb(error, token);
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
                // cb(err);
            } else {
                // cb(err, data);

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
        'ForgotPassword', {
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
                arg: 'ForgotPassword', type: 'array', root: true
            },
            http: {
                path: '/ForgotPassword',
                verb: 'post'
            },
            description: [
                'This instance for signing in to APAPUN.COM',
            ]
        });
    Apapunusers.ForgotPassword = function (params, options, cb) {
        const validate = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (validate.test(params.email)) {
            var datalogin = {
                email: params.email
            }
            var readHTMLFile = function(path, callback) {
                fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
                    if (err) {
                        throw err;
                        callback(err);
                    }
                    else {
                        callback(null, html);
                    }
                });
            };
            
            nodemailer.createTestAccount((err, account) => {
                // create reusable transporter object using the default SMTP transport
                let transporter = nodemailer.createTransport({
                    host: 'smtp.gmail.com',
                    port: 465 ,
                    secure: true, // true for 465, false for other ports
                    auth: {
                        user: "vmdidn@gmail.com", // generated ethereal user
                        pass: "visioncode" // generated ethereal password
                    }
                });

                readHTMLFile('./pages/mail.html', function(err, html) {
                    var template = handlebars.compile(html);
                    var replacements = {
                         username: "John Doe"
                    };
                    var htmlToSend = template(replacements);
            
                    // setup email data with unicode symbols
                    let mailOptions = {
                        from: '"VMD Indonesia 👻" <vmdidn@gmail.com>', // sender address
                        to: params.email, // list of receivers
                        subject: 'Forgot Password - APAPUN', // Subject line
                        text: 'Hello world?', // plain text body
                        html: htmlToSend // html body
                    };
                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            return console.log(error);
                        }
                        console.log('Message sent: %s', info.messageId);
                        // Preview only available when sending through an Ethereal account
                        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                
                        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
                        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
                    });
                });
            });
        }else{
            console.log("email tidak terkirim");
        }
        
    };
};
