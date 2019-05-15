const mongoose = require('mongoose')

const CodeSchema = new mongoose.Schema({
    value: {type: String, required: true},
    redirectUri: {type: String, required: true},
    userId: {type: String, requried: true},
    clientId: {type: String, required: true}
})

module.exports = mongoose.model('Code', CodeSchema)