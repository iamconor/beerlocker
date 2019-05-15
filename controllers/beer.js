const Beer = require('../models/beer')

exports.postBeers = (req, res) => {
    // create new instance of the beer model
    let beer = new Beer();

    // set the beer properties that came from the POST data
    beer.name = req.body.name
    beer.type = req.body.type
    beer.quantity = req.body.quantity
    beer.userId = req.user._id

    //save the beer and check for errors
    beer.save( (err) => {
        if (err)
            res.send(err)

        res.json({message: 'Beer added to the locker!', data: beer})
    })
}

exports.getBeers = (req, res) => {
    Beer.find({ userId: req.user._id }, (err, beers) => {
        if (err)
            res.send(err)

        res.json(beers)
    })
}

exports.getBeer = (req, res) => {
    Beer.findById({ userId: req.user._id, _id: req.params.beer_id }, (err, beer) => {
        if(err)
            res.send(err)
        
        res.json(beer)
    })
}

exports.putBeer = (req, res) => {
    Beer.findById({ userId: req.user._id, _id: req.params.beer_id }, (err, beer) => {
        if (err)
            res.send(err)

        beer.quantity = req.body.quantity

        beer.save( (err) => {
            if (err)
                res.send(err)

            res.json(beer)
        })
    })
}

exports.deleteBeer = (req, res) => {
    Beer.findByIdAndRemove({ userId: req.user._id, _id: req.params.beer_id }, (err) => {
        if (err)
            res.send(err)
        
        res.json({ message: 'Beer removed from the locker!' })
    })
}
