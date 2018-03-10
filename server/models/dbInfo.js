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
var updateKMS = function(mongo, idUser, points, callback){
    var response = {};

    mongo.users.find({_id: idUser}, function (err, user) {
        if (err) {
            response = {"status": 500, "res": {"message": "Error searching user"}};
        } else {

            var kmsTotales = 0;
            points.forEach( function (point) {
                kmsTotales += point.dist;
            });

            //updates points of teams and users
            mongo.teams.update({"name": user[0].team},{$inc:{"kms": kmsTotales}}, function (err) {
                    if (err) {
                        response = {"status": 500, "res": {"message": "Error searching user"}};
                    } else {
                        mongo.users.update({_id: idUser},{$inc:{"kms": kmsTotales}},function (err) {
                            if (err) {
                                response = {"status": 500, "res": {"message": "Error searching user"}};
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

//latitude and longitude to km
var distance = function(lat1, lon1, lat2, lon2, callback){
    var response = {};

    var latTotal = lat1 - lat2;
    var lonTotal = lon1 - lon2;

    var degTotal = math.sqrt(latTotal*latTotal+lonTotal*lonTotal);

    callback(response);

};

module.exports = {
    getInfoUser: getInfoUser,
    updateKMS: updateKMS
};
