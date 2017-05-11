var dayRouter = require('express').Router();

var db = require('../../models');
var Hotel = db.model('hotel');
var Restaurant = db.model('restaurant');
var Activity = db.model('activity');
var Place = db.model('place');
var Day = db.model('day');
var Promise = require('bluebird')

//get all the days
dayRouter.get('/', ((req, res, next) => {
    Day.findAll({
        include: [Hotel, Restaurant, Activity],
        order: 'number ASC'
    })
        .then(days => {
            res.send(days);
        });
}));

//get one specific day
dayRouter.get('/:dayNum', ((req, res, next) => {
    res.send(`dayNum: ${req.params.dayNum}`);
}));

//delete one specific day
dayRouter.delete('/:dayNum', ((req, res, next) => {

}));

//create a new day
dayRouter.post('/', ((req, res, next) => {
    console.log("this is the new day ", req.body)
    Day.create({
        number: req.body.number
    })
    .then(day => res.send(day))
    .catch(next);
}));

//HOTELS

//add a hotel
dayRouter.post('/:dayNum/hotels', (req, res, next) => {
    let dayId = req.params.dayId
    console.log(req.body)

    let findingHotel = Hotel.findOne({
         where: {name: req.body.hotelName}
        })

    let findingDay = Day.findOne({
       where: {id: dayId} 
    })
    
    Promise.all([findingHotel, findingDay])
        .spread(function(hotel, day){
            console.log("hey I'm here ", hotel.name)
            return day.setHotel(hotel)
        })
        .then(function(whatever) {
            res.send("hello")
        })
        .catch(next)
    
});

//delete a hotel
dayRouter.delete('/:dayNum/hotels', (req, res, next) => {
    
});

//RESTAURANTS

//add a restaurant
dayRouter.post('/:dayNum/restaurants', (req, res, next) => {

});

//delete a restaurant
dayRouter.delete('/:dayNum/restaurants', (req, res, next) => {
    
});

//ACTIVITIES

//add an activity
dayRouter.post('/:dayNum/activities', (req, res, next) => {

});

//delete an activity
dayRouter.delete('/:dayNum/activities', (req, res, next) => {
    
});

module.exports = dayRouter;