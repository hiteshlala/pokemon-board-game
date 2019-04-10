var mongoose = require('mongoose');
var gameBoardData = require('../data/gameBoardData.js');
var gymLeaderData = require('../data/gymLeaderData.js');
var pokemonData = require('../data/pokemonData.js');
var usersData = require('../data/usersData.js');
var availablePokemonData = require('../data/availablePokemonData.js');
var spriteData = require('../data/spriteData.js');

var Games = require('../game/gameModel.js');
var GymLeaders = require('../gymLeader/gymLeaderModel.js');
var Pokemons = require('../pokemon/pokemonModel.js');
var Users = require('../users/userModel.js');
var Sprites = require('../sprites/spriteModel.js');

//All these functions are only for testing purposes
//===========Create Table functions===========

var createUsers = function() {
  Users.find({}, function(err, users) {
    if (!users.length) {
      var newUsers = new Users({
        facebookId: 'Facebook123',
        playerName: 'Bob',
        gamesParticipating: [1],
        numGameWon: 0
      });
      newUsers.save(function(err) {
        if (!err) {
          console.log('createUser WORKS');
        }
      });
    }
  });
};

var createGymLeader = function() {
  GymLeaders.find({}, function(err, gymLeader) {
    if (!gymLeader.length) {
      GymLeaders.create(gymLeaderData, function (err) {
        if (!err) {
          console.log('createPokemon WORKS');
        }
      });
    }
  });
};

var createPokemons = function() {
  Pokemons.find({}, function(err, pokemon) {
    if (!pokemon.length) {
      Pokemons.create(pokemonData, function (err) {
        if (!err) {
          console.log('createPokemon WORKS');
        }
      });
    }
  });
};

var createGame = function() {
  Games.find({}, function(err, games) {
    if (!games.length){
      var newGame = new Games({
        gameId: 1,
        name: 'Hoooli Dungeon',
        users: [{
          facebookId: 'Facebook123',
          playerName: 'Bob'
        }],
        gameBoard: gameBoardData,
        availablePokemon: availablePokemonData,
        availableItemCards: [],
        gameCreator: {
          facebookId: 'Facebook123',
          playerName: 'Bob'
        },
        gameTurn: {
          facebookId: 'Facebook123',
          playerName: 'Bob'
        },
        gameStarted: true,
        gameCounter: 0
      });
      newGame.save(function(err) {
        if (!err) {
          console.log('createGames WORKS in db.js');
        }
      });
    }
  });
};

var createSprite = function() {
  Sprites.find({}, function(err, sprite) {
    if(!sprite.length) {
      Sprites.create(spriteData, function(err) {
        if(!err) {
          console.log('Created Sprites');
        }
      });
    }
  });
};




//===========Remove contents of the tables in the database===========
//===========Then Run Populate Table functions===========
Games.deleteOne({}, function(err) {
   console.log('Games collection removed');
})
.then(function(){
  createGame();
});

GymLeaders.deleteOne({}, function(err) {
   console.log('GymLeaders collection removed');
})
// .then(function(){
//   createGymLeader();
// });

Pokemons.deleteOne({}, function(err) {
   console.log('Pokemons collection removed');
})
// .then(function(){
//   createPokemons();
// });

Users.deleteOne({}, function(err) {
   console.log('Users collection removed');
})
.then(function(){
  createUsers();
});

Sprites.deleteOne({}, function(err) {
   console.log('Sprites collection removed');
})
// .then(function(){
//   createSprite();
// });


// initalize static database tables if they do not exist
var dbInit = function() {
  createGymLeader();
  createPokemons();
  createSprite();
}();
