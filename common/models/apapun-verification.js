'use strict';

module.exports = function(Apapunverification) {
    let request = require("request");
    let app = require("../../server/server");
    const nodemailer = require('nodemailer');
    var handlebars = require('handlebars');
    var fs = require('fs');

    Apapunverification.remoteMethod(
        'SendForgotVerification', {
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
                arg: 'SendForgotVerification', type: 'array', root: true
            },
            http: {
                path: '/SendForgotVerification',
                verb: 'post'
            },
            description: [
                'This instance for signing in to APAPUN.COM',
            ]
        });
    Apapunverification.SendForgotVerification = function (params, options, cb) {
        const validate = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (validate.test(params.email)) {
            var verificationCode = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            
            for (var i = 0; i < 6; i++){
                verificationCode += possible.charAt(Math.floor(Math.random() * possible.length));
            }

            
            let verifModel = app.models.ApapunVerification;
            verifModel.create({
                code : verificationCode.toUpperCase(),
                description : "forgot_password",
                email:params.email,
                status:"active",
                idUser : params.idUser
            }, function (error, token) {
                console.log(token);
                if (error) {
                    cb(error);
                    console.log(error.statusCode, 'Errornya');
                } else {                    
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

                        readHTMLFile('./../pages/mail.html', function(err, html) {
                            var template = handlebars.compile(html);
                            var replacements = {
                                Code: verificationCode.toUpperCase()
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
                                }else{
                                    cb(error, info);
                                }
                                console.log('Message sent: %s', info.messageId);
                                // Preview only available when sending through an Ethereal account
                                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                        
                                // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
                                // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
                            });
                        });
                    });
                }
            });
        }else{
            console.log("Format Email Salah");
        }
        
    };

        

    Apapunverification.remoteMethod(
        'SendAddBankVerification', {
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
                arg: 'SendAddBankVerification', type: 'array', root: true
            },
            http: {
                path: '/SendAddBankVerification',
                verb: 'post'
            },
            description: [
                'This instance for signing in to APAPUN.COM',
            ]
        });
    Apapunverification.SendAddBankVerification = function (params, options, cb) {
        
        let ModelUsersBank = app.models.ApapunUsers;
        ModelUsersBank.findById(params.userId, function (err, data) {
            if (err) {
                cb(err);
            } else {
                console.log(data.email," emailnya");
                const validate = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                if (validate.test(data.email)) {
                    var verificationCode = "";
                    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                    
                    for (var i = 0; i < 6; i++){
                        verificationCode += possible.charAt(Math.floor(Math.random() * possible.length));
                    }
                    Apapunverification.create({
                        code : verificationCode.toUpperCase(),
                        description : "add_bank",
                        email:data.email,
                        status:"active",
                        idUser : params.userId
                    }, function (error, token) {
                        console.log(token);
                        if (error) {
                            cb(error);
                            console.log(error.statusCode, 'Errornya');
                        } else {                    
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
        
                                readHTMLFile('./../pages/mail.html', function(err, html) {
                                    var template = handlebars.compile(html);
                                    var replacements = {
                                        Code: verificationCode.toUpperCase()
                                    };
                                    var htmlToSend = template(replacements);
                            
                                    // setup email data with unicode symbols
                                    let mailOptions = {
                                        from: '"VMD Indonesia 👻" <vmdidn@gmail.com>', // sender address
                                        to: data.email, // list of receivers
                                        subject: 'Add Bank Account Verification - APAPUN', // Subject line
                                        text: 'Hello world?', // plain text body
                                        html: htmlToSend // html body
                                    };
                                    transporter.sendMail(mailOptions, (error, info) => {
                                        if (error) {
                                            return console.log(error);
                                        }else{
                                            cb(error, info);
                                        }
                                        console.log('Message sent: %s', info.messageId);
                                        // Preview only available when sending through an Ethereal account
                                        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                                
                                        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
                                        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
                                    });
                                });
                            });
                        }
                    });
                }
            }
        });
    };
};
