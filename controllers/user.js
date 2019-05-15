const User = require('../models/user')

exports.postUsers = (req, res) => {
    let user = new User()

    user.username = req.body.username
    user.password = req.body.password

    user.save( function (err) {
        if (err) {
            console.log(error)
            res.send(err)
            return
        }
        res.json({ message: 'New beer drinker added to the locker room!'})
        return

    })
}

exports.getUsers = function (req, res) {
    User.find( function (err, users){
        if (err)
            res.send(err)
        
        res.json(users)
    })
}