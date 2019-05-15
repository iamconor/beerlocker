const passport = require('passport')
const User = require('../models/user')
const Client = require('../models/client')
const BasicStrategy = require('passport-http').BasicStrategy
const BearerStrategy = require('passport-http-bearer').Strategy
const Token = require('../models/token')

passport.use(new BasicStrategy (
    function (username, password, callback) {
        User.findOne({ username: username}, function (err, user) {
            if (err) { return callback(err) }

            // No user found with that username
            if (!user) { return callback(null, false) }

            // Make sure the password is correct
            console.log(user.verifyPassword)
            user.verifyPassword(password, function (err, isMatch) {
                if (err) { return callback(err)}

                // Password did not match
                if (!isMatch) { return callback(null, false)}

                // Success
                return callback(null, user)
            })
        })
    }
))

passport.use('client-basic', new BasicStrategy (
    (username, password, callback) => {
        Client.findOne({ id: username}, (err, client) => {
            if (err) {
                return callback(err);
            }

            // no client found with that id or bad password
            if(!client || client.secret !== password) {
                return callback(null, false)
            }

            // success
            return callback(null, client)
        })
    }
))

passport.use(new BearerStrategy(
    (accessToken, callback) => {
        Token.findOne({value: accessToken}, (err, token) => {
            if (err) {
                return callback(err)
            }
            // No token found
            if(!token) {
                return callback(null, false)
            }

            User.findOne({ _id: token.userId}, (err, user) => {
                if(err) {
                    return callback(err)
                }
                if(!user) {
                    return callback(null, false)
                }

                callback(null, user, {scope: '*'})
            })
        })
    }
))

exports.isAuthenticated = passport.authenticate(['basic', 'bearer'], { session : false })

exports.isClientAuthenticated = passport.authenticate('client-basic', {session: false})

exports.isBearerAuthenticated = passport.authenticate('bearer', {session: false})