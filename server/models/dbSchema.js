var mongoose    =   require("mongoose");
mongoose.connect('mongodb://localhost:27017/ucode2018');
mongoose.Promise = global.Promise;

// create instance of Schema
var mongoSchema = mongoose.Schema;
var objectId = mongoose.Schema.Types.ObjectId;


///Schema in db about users
var usersSchema = mongoose.Schema({
    name: String,
    email: String,
    lastName: String,
    idGoogle: String,
    token: String,
    team: String,
    urlPhoto: String,
    kms: Number,
    creationDate: Date   //fecha de creacion
//    isAdmin: Boolean,
});

var routesSchema = mongoose.Schema({
    idUser: objectId, //idUser of mongo
    creationDate: Date,
    points: [{lat: Number, lon:Number, dist:Number}],
    distance: Number,
    time: Number,
    speed: Number
});

var teamSchema = mongoose.Schema({
    name: String,
    kms: Number
});

var collectionSchema = mongoose.Schema({
    name: String,
    img: String, //url from img
    speed: Number
});

//create index for searching pois by keywords or name
//POIsSchema.index({keywords: "text", name: "text", city: "text", country: "text"});


//Export all collections
var users = mongoose.model('users',usersSchema);
var routes = mongoose.model('routes',routesSchema);
var teams = mongoose.model('teams',teamSchema);
var collections = mongoose.model('collections',collectionSchema);


module.exports = {
    users: users,
    routes: routes,
    teams: teams,
    collections: collections
};