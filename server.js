var express     = require("express");
var bodyParser  = require("body-parser");
var app         = express();
var router      = express.Router();

var database  = require("./server/models/dbInfo.js");
var mongo     = require("./server/models/dbSchema.js");
var routes    = require("./server/routes/routes.js")(router, mongo, app, database);

app.use(express.static('public'));

//Aceptaremos JSON y valores codificados en la propia URL
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/',router);

var server = app.listen(8888, function () {

    //database.createAdmin(mongo, app);
    console.log("Server listening in port %s...", server.address().port);
});
