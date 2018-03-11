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

//Return data of user with id
var updateKMS = function(mongo, idUser, distance, callback){
    var response = {};

    mongo.users.find({_id: idUser}, function (err, user) {
        if (err) {
            response = {"status": 500, "res": {"message": "Error updating points"}};
        } else {

            //updates points of teams and users
            mongo.teams.update({"idTeam": user[0].team},{$incr:{"distance": distance}}, function (err) {
                    if (err) {
                        response = {"status": 500, "res": {"message": "Error updating points"}};
                    } else {
                        mongo.users.update({_id: idUser},{$incr:{"distance": distance}},function (err) {
                            if (err) {
                                response = {"status": 500, "res": {"message": "Error updating points"}};
                            } else {
                                response = {"status": 200, "res": {"message": user}};
                            }}
                        );
                    }
                }
            );
        }
        callback(response);
    });
};

var getLastRoute =  function(mongo, idUser, callback){
    var response = {};

    mongo.routes.find({idUser: idUser}, function (err, data) {
        if (err) {
            response = {"status": 500, "message": "Error getting last route"};
        } else {
            console.log(data);
            response = {"status": 200, "message": data};
        }
        console.log(response);
        callback(response);
    }).sort({creationDate:-1}).limit(1);

};

//search recommendation using speed
var searchRecommendation =  function(mongo, speed, callback){
    var response = {};

    //search max
    mongo.collections.find({speed: {$gt:speed}}, function (err, data) {
        if (err) {
            response = {"status": 500, "message": "Error getting last route"};
        } else {
            console.log(data);
            response = {"status": 200, "message": data};
        }
        callback(response);
    }).sort({speed:1}).limit(1);

};



module.exports = {
    getInfoUser: getInfoUser,
    updateKMS: updateKMS,
    getLastRoute: getLastRoute,
    searchRecommendation: searchRecommendation
};
