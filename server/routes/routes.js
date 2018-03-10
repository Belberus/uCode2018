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
    })
};


    module.exports = appRouter;