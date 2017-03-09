"use strict";

exports.dateIncrement = function(currentDate, alterate, amount) {
    var timeLapse = {
        second: 1000,
        minute: 60000,
        hour: 3600000,
        day: 86400000,
        week: 604800000,
        month: 2592000000,
        year: 31536000000
    };

    var thisMoment = new Date(currentDate);

    return new Date(thisMoment + timeLapse[alterate] * amount).getTime();
}