var mongoose = require('mongoose');

//Return data of user with id
var getInfoUser = function(mongo, id, callback){
    var response = {};

    mongo.users.find({_id: id}, function (err, user) {
        if (err) {
            response = {"status": 500, "res": {"message": "Error searching user"}};
        } else {
            response = {"status": 200, "res": {"message": user}};
        }
        callback(response);
    });
};

module.exports = {
    getInfoUser: getInfoUser
};
