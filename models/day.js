const Sequelize = require('sequelize');
const db = require('./_db');
const Hotel = require('./hotel');
const Restaurant = require('./restaurant');
const Activity = require('./activity');
const Place = require('./place');

const Day = db.define('day', {
    number: {
        type: Sequelize.INTEGER
    }
});

Day.belongsTo(Hotel);
Day.belongsToMany(Restaurant, {through: 'day_restaurant'});
Day.belongsToMany(Activity, {through: 'day_activity'});



