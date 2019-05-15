'use strict';
const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const passport = require('passport')
const session = require('express-session')
const beerController = require('./controllers/beer')
const userController = require('./controllers/user')
const authController = require('./controllers/auth')
const clientController = require('./controllers/client')
const oauth2Controller = require('./controllers/oauth2')
const ejs = require('ejs')

mongoose.connect('mongodb://localhost:27017/beerlocker', { useNewUrlParser: true })

const app = express()

//Set view engine to ejs
app.set('view engine', 'ejs')

// Use the body-parser package in our application
app.use(bodyParser.urlencoded({
    extended: true
}))

// Use express session support since OAuth2orize requires it
app.use(session( {
    secret: 'Super Secret Session Key',
    saveUninitialized: true,
    resave: true
}))


//Use the passport package in our application
app.use(passport.initialize());


const port = 3000

const router = express.Router()

router.route('/clients')
    .post(authController.isAuthenticated, clientController.postClients)
    .get(authController.isAuthenticated, clientController.getClients)

router.route('/beers')
    .post(authController.isAuthenticated, beerController.postBeers)
    .get(authController.isAuthenticated, beerController.getBeers)

router.route('/beers/:beer_id')
    .get(authController.isAuthenticated, beerController.getBeer)
    .put(authController.isAuthenticated, beerController.putBeer)
    .delete(authController.isAuthenticated, beerController.deleteBeer)

router.route('/users')
    .post(userController.postUsers)
    .get(authController.isAuthenticated, userController.getUsers)

router.get('/', (req, res) => {
    console.log('hello world')
    res.json({message: 'You are running dangerously low on beer!'})
})

router.get('/gulp', function (req, res) {
    res.json({message: 'Gulp'})
})

router.route('/oauth2/authorize')
    .get(authController.isAuthenticated, oauth2Controller.authorization)
    .post(authController.isAuthenticated, oauth2Controller.decision)

router.route('/oauth2/token')
    .post(authController.isClientAuthenticated, oauth2Controller.token)

app.use('/api', router)

app.listen(port)

console.log('Insert beer on port ' + port)