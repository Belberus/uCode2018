var jwt = require('jsonwebtoken');
var xmlparser = require('express-xml-bodyparser');

var appRouter = function(router, mongo, app, database) {

    /**
     * Return info user if the user is register
     */
    router.get("/isRegistered/:id", function (req, res) {
        console.log("isRegistered");
        var res

        mongo.users.find({idGoogle: req.params.id}, function (err, data) {
            if (err) {
                response = {"status": 500, "message": "Error fetching data"};
            } else if (data.length == 0) {
                response = {"status": 404, "message": "User not found"};
            } else {
                response = {"status": 200, "message": data};
            }
            console.log(response);
            res.status(response.status).json(response.message);
        });
    }),

    /**
     * Save new user in database
     */
    router.post("/signIn", function (req, res) {
        console.log("signIn user");
        var r = JSON.parse(Object.keys(req.body)[0]);
        console.log(JSON.parse(Object.keys(req.body)[0]));

        var db = new mongo.users;

        db.name = r.name;
        db.email = r.email;
        db.lastName  = r.lastName;
        db.idGoogle = r.idGoogle;
        db.token = r.token;
        db.team = r.team;
        db.urlPhoto = r.urlPhoto;
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
        var r = JSON.parse(Object.keys(req.body)[0]);
        console.log(JSON.parse(Object.keys(req.body)[0]));

        var l = Object.keys(r.points).length;

        // console.log(Object.keys(r.points));
        // console.log(l);
        // console.log(Object.keys(r.points)[0].length);


        var p = [];
        var i ;
        for ( i = 0; i < r.points.length; i++) {
            console.log(r.points[i]);
            p[i]={ "lat": r.points[i].lat, "lng": r.points[i].lng}
        }
        console.log(p);

        var db = new mongo.routes;

        db.idUser = r.idUser; //google id
        db.creationDate = Date.now();
        db.points = p;
        db.distance = r.distance/1000;  //m to km
        db.time = r.time/3600;          //s to h
        db.speed = (r.distance/1000)/(r.time/3600);

        db.save(function (err, data) {
            if (err) {
                response = {"message": "Error adding route"};
                res.status(500).json(response);
            } else {
                //update kms in users and teams
                database.updateKMS(mongo, r.idUser, r.distance, function (response) {
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