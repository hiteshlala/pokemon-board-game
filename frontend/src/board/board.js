var app = angular.module('pokemon.board',[]);

app.controller('boardController', function( authFactory, $scope, gameDashboardFactory, boardFactory, userFactory, $window, $location, pokemonSocket, gameFactory) {
  
  const debug = false;

  if ( !authFactory.isAuth('boardController') ){
    debug && console.log( 'boardController isAuth', false );
    $location.path('/');
    return;
  }

   authFactory.getCurrentUser()
   .then( u => {
     debug && console.log( 'boardController user', u );
     $scope.name = u.name;
     $scope.email = u.email;
     $scope.gameId = u.gameId;
     initialize();
   })
   .catch( e => {
      debug && console.log( 'boardController getCurrentUser', e );
      $location.path('/');
   });

  $scope.playerOptions = [[],[]];
  $scope.userPosition;

  $scope.continueGame = true;
  $scope.confirmExit = true;
  $scope.pauseGameMessage = '';
  $scope.showexitoptions = true;

  $scope.roll = 0;
  $scope.rollDisplay = false;

  $scope.actionDisplay = false;
  $scope.actionDescription = '';
  var action;

  $scope.$on('$destroy', function () {
    pokemonSocket.removeAllListeners();
  });

  // alerts other players that someone has to stop playing
  // saves game state and gives users chance to go back to home page
  $scope.exitGame = function() {
    // emit a message to all in game that someone has left game
    var data = {
      gameId: $scope.gameId,
      user: { email: $scope.email, name: $scope.name },
      message: $scope.name + " is leaving game!  Resume game from Lobby Page after everyone is back.",
      continueGame: false
    };
    pokemonSocket.emit('player wants to pause game', data);
  };
  pokemonSocket.on('player leaving game', function(data) {
    // hide play options and make visible a button to move to home
    $scope.continueGame = false;
    $scope.pauseGameMessage = data.message;
    $scope.showexitoptions = false;
  });

  // used by checkbox to activate exit game button
  $scope.toggleConfirm = function() {
    $scope.confirmExit = !$scope.confirmExit;
  };

  // used by go home buton to redirect to home view
  $scope.goHome = function() {
    window.localStorage.removeItem("pokemon.gameId");
    $location.path('/home');
  };

  // section used for placement of players on board --------->>>>>>
  var distFromSpot = 28;
  var distFromSpot2 = 37;    // for small spot dist 28, dx -22, dy - 22
  $scope.dx = -22;           // for large spot dist 37, dx -22, dy - 22
  $scope.dy = -22;
  $scope.allPlayersBoard = [[0, distFromSpot],[distFromSpot * 0.866, distFromSpot / 2], [distFromSpot * 0.866, - distFromSpot / 2],
           [0, - distFromSpot],[- distFromSpot * 0.866, - distFromSpot / 2], [- distFromSpot * 0.866, distFromSpot / 2]];

  $scope.allPlayersBoard2 = [ [0, distFromSpot2], [distFromSpot2 * 0.866, distFromSpot2 / 2], [distFromSpot2 * 0.866, - distFromSpot2 / 2],
            [0, - distFromSpot2],[- distFromSpot2 * 0.866, - distFromSpot2 / 2], [- distFromSpot2 * 0.866, distFromSpot2 / 2]];
  // till here ---------------------------------------------<<<<<<<

  $scope.winner = null;
  
  pokemonSocket.on('winner announcement', function(data) {
    gameFactory.updateCurrentPage($scope.gameId, 'winnerView' )
      .then(function (resp) {
        redirect('winner');
      })
  });

  $scope.rollDice = function() {
    $scope.roll = Math.ceil(Math.random() * 6);
    // var arr = [1,2,3,4,5,6];
    // $scope.roll = arr[$scope.counter % 6];
    // $scope.counter ++;
    var audio = new Audio('../assets/sounds/dice.mp3');
    audio.play();
    pokemonSocket.emit('player rolled dice to move', {gameId: $scope.gameId, roll: $scope.roll});
    gameDashboardFactory.getPlayerOptions($scope.roll, $scope.userPosition, $scope.gameId, $scope.email)
      .then(function(options){
        $scope.playerOptions[0] = options.forwardOptions;
        $scope.playerOptions[1] = options.backwardOptions;
      });
  };
  pokemonSocket.on('send player roll to move', function(roll) {
    var audio = new Audio('../assets/sounds/dice.mp3');
    audio.play();
    $scope.roll = roll;
    $scope.rollDisplay = true;
  });

  // pokemonSocket.removeListener('send player roll to move')

  var resetOptions = function () {
    $scope.actionDisplay = true;
    $scope.playerOptions = [[], []];
  };

  var checkAction = function(typeOfAction) {
    switch (typeOfAction) {
      case 'pokemon':
        action = 'pokemon';
        $scope.actionDescription = $scope.currentTurnPlayerName + ' is about to catch a wild Pokemon!';
        resetOptions();
        break;
      case 'city':
        action = 'city';
        $scope.actionDescription = $scope.currentTurnPlayerName + ' has arrived in a city. Rest up!';
        resetOptions();
        break;
      case 'event':
        action = 'event';
        $scope.actionDescription = $scope.currentTurnPlayerName + ' landed on an event card!';
        resetOptions();
        break;
      case 'trainer':
        action = 'trainer';
        $scope.actionDescription = $scope.currentTurnPlayerName + ' has locked eyes on a trainer!';
        resetOptions();
        break;
    }
  };

  pokemonSocket.on('send player to move', function(data) {
    initialize();
    var audioMove = new Audio('../assets/sounds/swoosh.mp3');
    audioMove.play();
  });

  $scope.movePlayer = function(newSpot, userId) {
    var userObject = {
      email: $scope.email,
      name: $scope.name
    };

    userFactory.movePlayer(newSpot.id, userObject, $scope.userPosition, $scope.gameId)
      .then(function(position){
        pokemonSocket.emit('a player moved', {gameId: $scope.gameId, allUsers: $scope.allPlayers});
        $scope.userPosition = position.id;
        $scope.playerPosition = $scope.userPosition - 1;
        checkAction(newSpot.action);

        if (newSpot.action === 'pokemon') {
          $scope.actionDescription = $scope.currentTurnPlayerName + ' is about to catch a wild Pokemon!';
          $scope.actionDisplay = true;
          $scope.playerOptions = [[], []];

          gameFactory.getAvailablePokemon($scope.gameId, $scope.email);
        }

        pokemonSocket.emit('update action description', {
          gameId: $scope.gameId,
          description: $scope.actionDescription
        });
      });
  };

  pokemonSocket.on('send action description', function(description) {
    $scope.actionDescription = description;
    $scope.actionDisplay = true;
  });

  var redirect = function(action) {
    switch (action) {
      case 'pokemon':
        $location.path('/capture');
        break;
      case 'city':
        $location.path('/city');
        break;
      case 'event':
        $location.path('/event');
        break;
      case 'trainer':
        $location.path('/trainer');
        break;
      case 'winner':
        $location.path('/winner');
        break;
    }
  };

  var updateCurrentPage = currentPage => {
    gameFactory.updateCurrentPage($scope.gameId, currentPage )
    .then(function(){
      pokemonSocket.emit('redirect users to action', {gameId: $scope.gameId, action: action});
      redirect(action);
    });
  };

  $scope.redirectAllUsers = function() {
    var audioRedir = new Audio('../assets/sounds/pop.mp3');
    audioRedir.play();
    switch (action) {
      case 'pokemon':
        updateCurrentPage('captureView');
        break;
      case 'city':
        updateCurrentPage('cityView');
        break;
      case 'event':
        updateCurrentPage('eventView');
        break;
      case 'trainer':
        updateCurrentPage('trainerView');
        break;
    }
  };

  pokemonSocket.on('send redirect path to users', function(action){
    redirect(action);
    var audioRedir = new Audio('../assets/sounds/pop.mp3');
    audioRedir.play();
  });

  var confirmCurrentPage = function() {
    debug && console.log( 'boardController confirmCurrentPage', $scope.gameId, $scope.email, $scope.name );
    gameFactory.getCurrentPage($scope.gameId)
    .then(function(currentPage){
      debug && console.log( 'boardController confirmCurrentPage getCurrentPage currentPage:', currentPage );
      if (currentPage === 'boardView') {
        initialize();
      }
      else {
        switch (currentPage) {
          case 'starterView':
            $location.path('/starter');
            break;
          case 'cityView':
            $location.path('/city');
            break;
          case 'captureView':
            $location.path('/capture');
            break;
          case 'eventView':
            $location.path('/event');
            break;
          case 'trainerView':
            $location.path('/trainer');
            break;
          case 'winnerView':
            $location.path('/winner');
            break;
        }
      }
    });
  };

  var sortPokemon = function(pokemonArray) {
    var pokemonByColor = {
      starter: [],
      pink: [],
      green:[],
      blue: [],
      red: [],
      gold: []
    };

    for (var i = 0; i < pokemonArray.length; i++) {
      var pokemon = pokemonArray[i];
      pokemonByColor[pokemon.color].push(pokemon);
    }

    return pokemonByColor;
  };

  $scope.userInfoPanel = false;

  $scope.togglePanel = function() {
    const audioPop = new Audio('../assets/sounds/pop.mp3');
    audioPop.play();
    $scope.userInfoPanel = !$scope.userInfoPanel;
  };

  var initialize = function() {
    debug && console.log( 'boardController initialize', $scope.gameId, $scope.email, $scope.name );
    boardFactory.boardInit($scope.gameId, $scope.email)
    .then(function(data){
      debug && console.log( 'boardController initialize boardInit data', $scope.gameId, data );
      // get board data from database
      // preprocessed to be an array 
      // calculate path data and path string
      $scope.boardData = boardFactory.createBoardArray(data.board);
      $scope.pathData = boardFactory.createPath($scope.boardData);
      $scope.pathString = boardFactory.createPathString($scope.pathData);

      $scope.currentTurnPlayerName = data.currentTurn.name;
      $scope.currentTurnEmail = data.currentTurn.email;
      for(var i = 0; i < data.allUsers.length; i++) {
        if(data.currentTurn.email == data.allUsers[i].email) {
          $scope.currentTurnSprite = data.allUsers[i].sprite;
        }
      }
      $scope.userPosition = data.user.positionOnBoard;
      $scope.playerPosition = $scope.userPosition - 1;
      
      $scope.userParty = sortPokemon(data.user.party);

      $scope.allPlayers = data.allUsers;
      $scope.winner = data.winner;
      if($scope.winner !== null) {
        pokemonSocket.emit('player won', { gameId: $scope.gameId, winner: $scope.winner});
      }

      $scope.playerSprite = data.user.sprite;
      $scope.playerParty = data.user.party;
     
      // confirmCurrentPage();
    });
  };

  // confirmCurrentPage();
});

app.config(function($sceDelegateProvider) {
  $sceDelegateProvider.resourceUrlWhitelist([
    // Allow same origin resource loads.
    'self',
    // Allow loading from outer templates domain.
    'http://sprites.pokecheck.org/i/**',
    'http://pokeapi.co/media/img/**',
    'http://sprites.pokecheck.org/t/**',
    'http://www.pokestadium.com/sprites/xy/**',
    'http://vignette**',
    'http://i893.**',
    'http://i573.**',
    'http://orig02.deviantart.net/**',
    'http://orig15.deviantart.net/**',
    'http://67.media.tumblr.com/**',
    'http://66.media.tumblr.com/**'
  ]);
});

app.factory('boardFactory', function($http) {

  var createBoardArray = function(board) {
    // this section adds rows and columns onto data from
    // database

    var xyVals = [[],[2,3],[4.5,2.5], [5,1.2],[6.3,2.2],[8.2,2.3],[9.5,1.5],[10.5,3.2],[12.3,1],[11.5,4.5],[12,7.3],[10,6.5],
      [8.2,5.2],[6.8,4.3],[4.8,5.1],[2.6,4.7],[1.2,6.8],[1.3,9],[3.8,9],[4,6.8],[6.8,7],[9,8.4],[15.8,8.4],[14.5,7],[14,4.2],
      [15,2.8],[15.6,1],[17.2,2],[19,3],[19.5,1.3],[23,1.4],[23.6,3.6],[21,5],[18.5,5.5],[17,4.4],[16,6],[19,8],[21,7],[23,6.5],
      [23.1,8.5],[22,10.2],[23.3,13],[23.7,15],[21.2,15],[20.8,12.9],[20.5,10],[21.3,8.5],[19,9.3],[17.2,9],[16.6,10.4],
      [16.6,12.5],[19,14],[19,16],[17,15.5],[15,14],[13.7,15.4],[11.8,14.7],[13,12.4],[11,11],[10.2,13.5],[7.9,12.4],[8.5,14.5],
      [7,15.5],[5,14.5],[3.5,16],[1.4,14.1],[1,11],[2.8,13],[5.2,12.9],[4.5,10.8],[6.7,12],[8,10.8],[6,8.6],[11.5,9.5]];

    for(var i = 1; i <= 73; i++) {
      board[i].row = (xyVals[i][1] * 3.5) * 10;
      board[i].col = ((xyVals[i][0] * 3.6) + 10) * 10 - 112;
    }

    var boardArray = [];
    for(var key in board) {
      boardArray.push(board[key]);
    }
    return boardArray;
  };

  var createPath = function(boardArray) {
    var path = boardArray.map(function(item, index) {
      var x = item.col;
      var y = item.row;
      return [x, y];
    });
    return path;
  };

  var createPathString = function(coordinates) {
      var coords = coordinates.map(function(xypair){
        return xypair[0] + ',' + xypair[1];
      });
      coords = coords.join('L');
      coords = 'M' + coords;
      return coords;
  };

  //Output Returns data to initialize the board 
  //**********Should Be Renamed Later to Initialize Board View
  //Returns data object with board, current user data, and Current Turn
  var boardInit = function(gameId, userId) {
    return $http({
      method: 'GET',
      url: '/api/games/boardInit',
      params: {
        gameId: gameId,
        userId: userId
      }
    })
    .then(function(resp) {
      return resp.data;
    });
  };

  return {
    boardInit: boardInit,
    createPath: createPath,
    createBoardArray: createBoardArray,
    createPathString: createPathString
  };
});
