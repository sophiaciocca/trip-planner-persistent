var dayRouter = require('express').Router();

var db = require('../../models');
var Hotel = db.model('hotel');
var Restaurant = db.model('restaurant');
var Activity = db.model('activity');
var Place = db.model('place');
var Day = db.model('day');

//get all the days
dayRouter.get('/', ((req, res, next) => {
    Day.findAll()
        .then(days => res.json("days: ", days));
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
    Day.create(req.body)
        .then(day => res.send("We made the day"))
        .catch(next);
}));

//HOTELS

//add a hotel
dayRouter.post('/:dayNum/hotels', (req, res, next) => {

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