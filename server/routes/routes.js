var jwt = require('jsonwebtoken');
var xmlparser = require('express-xml-bodyparser');

var appRouter = function(router, mongo, app, database) {

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

        db.save(function (err, data) {
            if (err) {
                response = {"message": "Error adding route"};
                res.status(500).json(response);
            } else {
                //update kms in users and teams
                database.updateKMS(mongo, req.body.idUser, req.body.points, function (response) {
                    console.log(response);
                    res.status(200).json(response)
                });
               // response = {"message": data._id};
            }
        });


    }),

    /**
     * Get routes using id route
     */
    router.get("/getRoute/:id", function (req, res) {
        console.log("getting route");

        console.log(req.params.id);
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
    })
};

    module.exports = appRouter;