const mongoose = require('mongoose')
const bcrypt = require('bcrypt-nodejs')

let UserSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        requried: true
    }
})

UserSchema.pre('save', function (callback){
    let user = this;

    if (!user.isModified('password')) return callback()

    bcrypt.genSalt(5, function (err, salt) {
        if(err) return callback(err)

        bcrypt.hash(user.password, salt, null, function (err, hash) {
            if (err) return callback(err)

            user.password = hash
            callback()
        })
    })
})

UserSchema.methods.verifyPassword = function (password, cb){
    bcrypt.compare(password, this.password, function (err, isMatch) {
        if (err) return cb(err)
        cb(null, isMatch)
    })
}

module.exports = mongoose.model('User', UserSchema)