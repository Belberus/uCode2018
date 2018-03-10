var jwt = require('jsonwebtoken');
var xmlparser = require('express-xml-bodyparser');

var appRouter = function(router, mongo, app, database) {

    /**
     * Return info user if the user is register
     */
    router.get("/isRegistered/:id", function (req, res) {
        console.log("isRegistered");

        mongo.users.find({idGoogle: req.params.id}, function (err, data) {
            if (err) {
                response = {"status": 500, "message": "Error fetching data"};
            } else {
                console.log(data);
                response = {"status": 200, "message": data};
            }
            res.status(response.status).json(response.message);
        });
    }),

    /**
     * Save new user in database
     */
    router.post("/signIn", function (req, res) {
        console.log("signIn user");
        var db = new mongo.users;

        db.name = req.body.name;
        db.email = req.body.email;
        db.lastName  = req.body.lastName;
        db.idGoogle = req.body.idGoogle;
        db.token = req.body.token;
        db.team = req.body.team;
        db.urlPhoto = req.body.urlPhoto;
        db.creationDate = Date.now();

        db.save(function (err, data) {
            if (err) {
                response = {"message": "Error adding user"};
                res.status(500).json(response);
            } else {
                response = {"message": data._id};
                res.status(200).json(response)
            }
            console.log(response);
        });
    }),

    /**
     * Save new route in database
     */
    router.post("/postRoute", function (req, res) {
        console.log("posting route");
        var db = new mongo.routes;

        db.idUser = req.body.idUser;
        db.creationDate = Date.now();
        db.points = req.body.points;
        db.distance = req.body.distance;
        db.time = req.body.time;
        db.speed = req.body.distance/req.body.time; //

        db.save(function (err, data) {
            if (err) {
                response = {"message": "Error adding route"};
                res.status(500).json(response);
            } else {
                //update kms in users and teams
                database.updateKMS(mongo, req.body.idUser, req.body.distance, function (response) {
                    console.log(response);
                    res.status(200).json(response)
                });
            }
        });


    }),

    /**
     * Get routes using id route
     */
    router.get("/getRoute/:id", function (req, res) {
        console.log("getting route");

                mongo.routes.find({idUser: req.params.id}, function (err, data) {
            if (err) {
                response = {"status": 500, "message": "Error fetching data"};
            } else {
                response = {"status": 200, "message": data};
            }
            res.status(response.status).json(response.message);
        });
    }),

    /**
     * Get points of all teams
     */
    router.get("/getPoints", function (req, res) {
        console.log("getting points");

        mongo.teams.find({}, function (err, data) {
            if (err) {
                response = {"status": 500, "message": "Error fetching data"};
            } else {
                console.log(data);
                response = {"status": 200, "message": data};
            }
            console.log(data);
            res.status(response.status).json(response.message);
        });
    }),

    /**
     * Get recommendations to user
     */
    router.get("/getRecommendations/:id", function (req, res) {
        console.log("getting recommendations");

        //get last route from user
        database.getLastRoute(mongo, req.params.id, function (response) {
            console.log(response.message[0].speed); // get speed

            //search recommendation
            database.searchRecommendation(mongo, response.message[0].speed, function (response) {
                console.log(response.message[0]);
                res.status(200).json(response)
            })
        });

    })
};

    module.exports = appRouter;