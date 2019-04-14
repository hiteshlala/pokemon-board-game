

angular.module('services', [])
.factory('authFactory', function ($http, $cookies, $location) {
  const debug = false;
  debug && console.log( 'authFactory called')
  const user = {
    email: '',
    name: '',
    gameId: -1
  };
  let isLoggedIn = false;
  const reset = () => {
    user.email = '';
    user.name = '';
    user.gameId = -1;
    isLoggedIn = false;
  }
  if ( $cookies.get( 'pokemon.session' ) && !user.email ) {
    getUserInfo()
    .then( u => {
      user.email = u.email;
      user.name = u.name;
      isLoggedIn = u.result;
    })
    .catch( e => {
      debug && console.error( e );
      logout();
    });
  }

  const sendCode = ( email ) => {
    return $http({
      method: 'POST',
      url: 'login',
      data: {
        email
      }
    })
    .then(function (resp) {
      return resp.data;
    });
  }
  const verifyCode = ( email, code ) => {
    let data = { result: false, message:'' };
    return $http({
      method: 'POST',
      url: 'login/verify',
      data: {
        email,
        code
      }
    })
    .then( resp => {
      debug && console.log( 'verifyCode', resp.data );
      data = resp.data;
      isLoggedIn = data.result;
      return getUserInfo();
    })
    .then( () => data );
  }

  function getUserInfo() {
    return $http({
      method: 'GET',
      url: 'user'
    })
    .then( resp => {
      user.email = resp.data.email;
      user.name = resp.data.name
      return resp.data;
    });  
  }

  function getCurrentUser() {
    debug && console.log( 'authFactory getCurrentUser', user );
    return isLoggedIn ? Promise.resolve( user ) : $location.path('/signin') && null;
  }

  function logOut() {
    reset();
    $cookies.remove( 'pokemon.session' );
    $location.path('/signin');
  }

  return {
    isAuth: (a) => { debug && console.log( 'isAuth() from',a, isLoggedIn); return isLoggedIn; },
    getSession: () => $cookies.get( 'pokemon.session' ),
    sendCode,
    verifyCode,
    getCurrentUser,
    logOut,
    getGameId: () => user.gameId,
    setGameId: id => { user.gameId = id; },
    delGameId: () => { user.gameId = -1; }
  };
})
.factory('userFactory', function ($http) {

  var playerInit = function (gameId, userId, pokemon, sprite) {
    return $http({
      method: 'PUT',
      url: 'api/games/addpokemon',
      data: {
        gameId: gameId,
        userId: userId,
        pokemon: pokemon,
        sprite: sprite
      }
    })
    .then(function (resp) {
      return resp.data;
    });
  };

  var addGame = function (gameId, gameName, gameCreator, playerName) {
    return $http({
      method: 'POST',
      url: 'api/games/addgame',
      data: {
        gameId: gameId,
        gameName: gameName,
        email: gameCreator,
        name: playerName
      }
    })
    .then(function (resp) {
      return resp.data;
    });
  };
 
  var getGames = function () {
    return $http({
      method: 'GET',
      url: 'api/games/getGames',
    })
    .then(function (resp) {
      return resp.data;
    });
  };

  var movePlayer = function (nextPosition, user, currentPosition, gameId) {
    return $http({
      method: 'PUT',
      url: 'api/games/user/movePlayer',
      data: {
        nextPosition: nextPosition,
        currentPosition: currentPosition,
        user: user,
        gameId: gameId
      }
    })
    .then(function (resp) {
      return resp.data;
    });
  };

  var getUsers = function (gameId) {
    return $http({
      method: 'GET',
      url: 'api/games/getusers',
      params: {
        gameId: gameId
      }
    }).
    then(function (resp) {
      return resp.data;
    });
  };

  return {
    playerInit: playerInit,
    addGame: addGame,
    getGames: getGames,
    movePlayer: movePlayer,
    getUsers: getUsers
  };
  
})

.factory('gameDashboardFactory', function ($http) {
  //Input: Receives dice roll, userId, and gameId
  //Output: Retrieves an array of possible game spots to move
  var getPlayerOptions = function (roll, userPosition, gameId, userId) {
    return $http({
      method: 'GET',
      url: '/api/games/playerOptions',
      params: {
        roll: roll,
        gameId: gameId,
        userId: userId,
        userPosition: userPosition
      }
    })
    .then(function (resp) {
      return resp.data;
    });
  };

  return {
    getPlayerOptions: getPlayerOptions
  };

})

.factory('gameFactory', function ($http) {
  const debug = false;
  var trainerInit = function(gameId, currentTurnUserId) {
    return $http({
      method: 'GET',
      url: 'api/games/trainerInit',
      params: {
        gameId: gameId,
        currentTurnUserId: currentTurnUserId
      }
    })
    .then(function (resp) {
      return resp.data;
    });
  };

  var lobbyInit = function (gameId) {
    return $http({
      method: 'GET',
      url: 'api/games/lobbyinit',
      params: {
        gameId: gameId
      }
    })
    .then(function (resp) {
      return resp.data;
    });
  };

  var resumeGameLobbyInit = function (gameId) {
    return $http({
      method: 'GET',
      url: 'api/games/resumegamelobbyinit',
      params: {
        gameId: gameId
      }
    })
    .then(function (resp) {
      return resp.data;
    });
  };

  var addUsers = function (gameId, users) {
    return $http({
      method: 'PUT',
      url: 'api/games/user',
      data: {
        gameId: gameId,
        users: users
      }
    })
    .then(function (resp) {
      return resp.data;
    });
  };

  var getGameTurn = function (gameId) {
    return $http({
      method: 'GET',
      url: 'api/games/gameturn',
      params: {
        gameId: gameId
      }
    })
    .then(function (resp) {
      return resp.data;
    });
  };

  var catchPokemon = function (gameId, userId, roll, pokemonColor, pokemon) {
    return $http({
      method: 'PUT',
      url: 'api/games/user/catchPokemon',
      data: {
        gameId: gameId,
        userId: userId,
        roll: roll,
        pokemonColor: pokemonColor,
        pokemon: pokemon
      }
    })
    .then(function (resp) {
      return resp.data;
    });
  };

  var getAvailablePokemon = function(gameId, userId) {
    return $http({
      method: 'GET',
      url: '/api/games/availablePokemon',
      params: {
        gameId: gameId,
        userId: userId
      }
    })
    .then(function(resp) {
      return resp.data;
    });
  };
// updateTurn function updates the game turn and sets the new currentpage
  var updateTurn = function (gameId, currentPage) {
    return $http({
      method: 'PUT',
      url: 'api/games/updateturn',
      data: {
        gameId: gameId,
        currentPage: currentPage
      }
    })
    .then(function (resp) {
      return resp.data;
    });
  };

  var getRemainingStarterPokemon = function( gameId ) {
    return $http({
      method: "GET",
      url: '/api/games/remainingStarterPokemon',
      params: {
        gameId: gameId
      }
    })
    .then(function(resp) {
      return resp.data;
    });
  };

  var getCurrentPage = function(gameId) {
    debug && console.log( 'gameFactory getCurrentPage gameId', gameId)
    return $http({
      method: 'GET',
      url: '/api/games/currentPage',
      params: {
        gameId: gameId
      }
    })
    .then(function(resp) {
      return resp.data;
    });
  };
// updateCurrentPage function updates the current page of the game
  var updateCurrentPage = function(gameId, currentPage) {
    debug && console.log( 'gameFactory updateCurrentPage gameId:', gameId, 'currentPage:', currentPage );
    return $http({
      method: 'PUT',
      url: '/api/games/currentPage',
      data: {
        gameId: gameId,
        currentPage: currentPage
      }
    })
    .then(function(resp) {
      return resp.data;
    });
  };

  var getRemainingSprites = function(gameId) {
    return $http({
      method: "GET",
      url: '/api/games/remainingSprites',
      params: {
        gameId: gameId
      }
    })
    .then(function(resp) {
      return resp.data;
    });
  };

  var requestLobbyEntry = function(gameId) {
    return $http({
      method: 'PUT',
      url: '/api/games/requestlobbyentry',
      data: {
        gameId: gameId
      }
    })
    .then(function (resp) {
      return resp.data;
    });
  };

  var getEventGif = function () {
    return $http({
      method: 'GET',
      url: '/api/tempEvents/getURL'
    })
    .then(function (resp) {
      return resp.data;
    });
  };

  var updatePlayerCounter = function(gameId) {
    return $http({
      method: 'PUT',
      url: '/api/games/updateplayercounter',
      data: {
        gameId: gameId
      }
    })
    .then(function (resp) {
      return resp.data;
    });
  };

  var getCityGif = function () {
    return $http({
      method: 'GET',
      url: 'api/tempCity/getURL',
     })
    .then(function (resp) {
       return resp.data;
    });
  };

  return {
    trainerInit: trainerInit,
    updateCurrentPage: updateCurrentPage,
    getCurrentPage: getCurrentPage,
    lobbyInit: lobbyInit,
    addUsers: addUsers,
    getGameTurn: getGameTurn,
    catchPokemon: catchPokemon,
    getAvailablePokemon: getAvailablePokemon,
    updateTurn: updateTurn,
    getRemainingStarterPokemon: getRemainingStarterPokemon,
    getRemainingSprites: getRemainingSprites,
    requestLobbyEntry: requestLobbyEntry,
    updatePlayerCounter: updatePlayerCounter,
    getCityGif: getCityGif,
    getEventGif: getEventGif,
    resumeGameLobbyInit: resumeGameLobbyInit
  };

})

.factory('pokemonSocket', function(socketFactory) {
  console.log("+++++++++++++++++++++POKEMONSOCKET++++++++++++++++++++++++")
  return socketFactory();
});