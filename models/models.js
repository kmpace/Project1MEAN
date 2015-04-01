var mongoose = require("mongoose");

var PersonSchema = new mongoose.Schema({
  name: String,
  things: [{
    type: mongoose.Schema.ObjectId,
    ref: "Thing"
  }],
  numberOfThings: {
    type: Number,
    default: 0
  }

  place: [{
  type: mongoose.Schema.ObjectId,
  ref: "Place"
  }]

  numberofFavoritePlaces: {
    type: Number,
    default: 0 

  }


});

PersonSchema.statics.getOneByName = function(name, cb) {
  this.findOne({
    name: name
  }).populate("things").exec(cb);
};

PersonSchema.statics.getOneById = function(id, cb) {
  this.findOne({
    _id: id
  }, cb);
};

PersonSchema.statics.getAll = function(cb) {
  this.find({}).sort("name").exec(cb);
};

PersonSchema.statics.acquire = function(personId, thingId, cb) {
  Thing.findById(thingId, function(err, _thing) {
    if (_thing.numberInStock <= 0)
      return cb({
        message: "NONE_IN_STOCK"
      });
    var qry = {
      _id: personId
    };
    var update = {
      $push: {
        things: thingId
      },
      $inc: {
        numberOfThings: 1
      }
    };
    Person.update(qry, update, function(err) {
      var query = {
        _id: thingId
      };
      var update = {
        $inc: {
          numberOwned: 1,
          numberInStock: -1
        }
      }
      Thing.update(query, update, function() {
        cb();
      });
    });
  });
};

PersonSchema.statics.returnThing = function(personId, thingId, cb) {
  this.findById(personId, function(err, _person) {
    var index = _person.things.indexOf(thingId);
    if (index == -1)
      return cb({
        message: "USER_DOES_NOT_OWN"
      }, null);
    _person.things.splice(index, 1);
    _person.numberOwned = _person.numberOwned + 1;
    _person.save(function(err) {
      var query = {
        _id: thingId
      };
      var update = {
        $inc: {
          numberOwned: -1,
          numberInStock: 1
        }
      };
      Thing.update(query, update, function() {
        cb();
      });
    });
  });
};


PersonSchema.statics.findAllWhoFavoritedPlace = function (placeId, cb){
this.findOne({
  place: place
}).populate("place").exec(cb);

};

PersonSchema.static.addPlace = function (personId, placeId, cb){
  Place.findbyId(placeId, function(err, _place){

    var query = {
      _id: personId

    };

    var updateFavoritePlaces = {
      $push: {
        place: placeId

      },

      $inc: {
        numberofFavoritePlaces: 1
      }
    };

    Person.update(query, updateFavoritePlaces, function(err){
      var placeQuery = {
        _id: placeID

      };

      var update = {
        $inc: {
          numberofTimesFavorited:1

        }

      }
      Place.update(placeQuery, update, function(){
        cb();
      });
    });

  });

};

PersonSchema.static.removePlace = function (personId, placeId, cb){
  Place.findbyId(placeId, function(err, _place){

    var query = {
      _id: personId

    };

    var updateFavoritePlaces = {
      $pull: {
        place: placeId

      },

      $inc: {
        numberofFavoritePlaces: -1
      }
    };

    Person.update(query, updateFavoritePlaces, function(err){
      var placeQuery = {
        _id: placeID

      };

      var update = {
        $inc: {
          numberofTimesFavorited: -1

        }

      }
      Place.update(placeQuery, update, function(){
        cb();
      });
    });

  });

};
var Person = mongoose.model("Person", PersonSchema);

var ThingSchema = new mongoose.Schema({
  name: String,
  numberOwned: {
    type: Number,
    default: 0
  },
  numberInStock: Number
});

ThingSchema.statics.getOneByName = function(name, cb) {
  this.findOne({
    name: name
  }, cb);
};

ThingSchema.statics.getOneById = function(id, cb) {
  this.findById(id, cb);
};

ThingSchema.statics.getAll = function(cb) {
  this.find({}).sort("name").exec(cb);
};

var Thing = mongoose.model("Thing", ThingSchema);





var PlacesSchema = new mongoose.Scheme ({
  name: String,
  numberofTimesFavorited: {
    type: Number,
    default: 0
  }
});

PlacesSchema.statics.getOneByName = function (name, cb) {
  this.findOne({
    name:name 
  }).populate("names").exec(cb);
};

PlacesSchema.statics.getOneById = function (id, cb){
  this.findOne({
    _id:id
  }, cb);
};

PlacesSchema.statics.getAll = function (cb) {
this.find({}).sort("name").exec(cb);

};

PlacesSchema.statics.getAllFavoritedPlaces =  function (cb) {
if (numberofTimesFavorited > 0){
  return cb ({ 
    name;
  });
};
};

PlacesSchema.statics.getAllUnfavoritedPlaces = function (cb) {
  if (numberofTimesFavorited <=  0){
    return cb ({
      name;

    });


  };


};


function seed(cb) {
  var people = [{
    name: "Moe"
  }, {
    name: "Larry"
  }, {
    name: "Curly"
  }];
  var things = [{
    name: "Rock",
    numberInStock: 10
  }, {
    name: "Paper",
    numberInStock: 10
  }, {
    name: "Scissors",
    numberInStock: 10
  }];

  var places = [{
    name: "New York"
  }, {
    name: "Paris"
  }, {
    name: "London"
}];

Person.remove({}, function() {
  Person.create(people, function(err, moe, larry, curly) {
    Thing.remove({}, function() {
      Thing.create(things, function(err, rock, paper, scissors) {
        cb(err, moe, larry, curly, rock, paper, scissors);
        Place.remove({}, function(){
          Place.create(places function(New York, Paris, London) {
            cb(err, New York, Paris, London);

          };
        });
        });
      });
    });
  }

module.exports = {
  seed: seed,
  Person: Person,
  Thing: Thing,
  Place: Place

};