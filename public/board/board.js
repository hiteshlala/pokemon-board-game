var app = angular.module('pokemon.board',[])

var fakeboard = [
{typeOfSpot:"pokemon",colorOfSpot:"pink",users:[],gymLeader:4,row:0,col:1},
{typeOfSpot:"city",colorOfSpot:"pink",users:[],gymLeader:0,row:0,col:2},
{typeOfSpot:"pokemon",colorOfSpot:"pink",users:[],gymLeader:4,row:0,col:3},
{typeOfSpot:"pokemon",colorOfSpot:"pink",users:[],gymLeader:1,row:0,col:4},
{typeOfSpot:"event",colorOfSpot:"pink",users:[],gymLeader:1,row:0,col:5},
{typeOfSpot:"event",colorOfSpot:"pink",users:[],gymLeader:4,row:0,col:6},
{typeOfSpot:"pokemon",colorOfSpot:"pink",users:[],gymLeader:5,row:0,col:7},
{typeOfSpot:"city",colorOfSpot:"pink",users:[],gymLeader:1,row:0,col:8},
{typeOfSpot:"event",colorOfSpot:"pink",users:[],gymLeader:5,row:0,col:9},
{typeOfSpot:"pokemon",colorOfSpot:"pink",users:[],gymLeader:4,row:0,col:10},
{typeOfSpot:"city",colorOfSpot:"pink",users:[],gymLeader:7,row:0,col:11},
{typeOfSpot:"event",colorOfSpot:"pink",users:[],gymLeader:7,row:0,col:12},
{typeOfSpot:"city",colorOfSpot:"pink",users:[],gymLeader:3,row:0,col:13},
{typeOfSpot:"city",colorOfSpot:"pink",users:[],gymLeader:5,row:0,col:14},
{typeOfSpot:"city",colorOfSpot:"pink",users:[],gymLeader:6,row:0,col:15},
{typeOfSpot:"city",colorOfSpot:"pink",users:[],gymLeader:5,row:0,col:16},
{typeOfSpot:"city",colorOfSpot:"pink",users:[],gymLeader:1,row:0,col:17},
{typeOfSpot:"event",colorOfSpot:"green",users:[],gymLeader:7,row:1,col:18},
{typeOfSpot:"event",colorOfSpot:"green",users:[],gymLeader:2,row:1,col:19},
{typeOfSpot:"pokemon",colorOfSpot:"green",users:[],gymLeader:0,row:1,col:0},
{typeOfSpot:"event",colorOfSpot:"green",users:[],gymLeader:1,row:1,col:1},
{typeOfSpot:"pokemon",colorOfSpot:"green",users:[],gymLeader:3,row:1,col:2},
{typeOfSpot:"pokemon",colorOfSpot:"green",users:[],gymLeader:4,row:1,col:3},
{typeOfSpot:"pokemon",colorOfSpot:"green",users:[],gymLeader:0,row:1,col:4},
{typeOfSpot:"pokemon",colorOfSpot:"green",users:[],gymLeader:2,row:1,col:5},
{typeOfSpot:"pokemon",colorOfSpot:"green",users:[],gymLeader:4,row:1,col:6},
{typeOfSpot:"pokemon",colorOfSpot:"green",users:[],gymLeader:2,row:1,col:7},
{typeOfSpot:"pokemon",colorOfSpot:"green",users:[],gymLeader:3,row:1,col:8},
{typeOfSpot:"city",colorOfSpot:"green",users:[],gymLeader:5,row:1,col:9},
{typeOfSpot:"pokemon",colorOfSpot:"green",users:[],gymLeader:1,row:1,col:10},
{typeOfSpot:"city",colorOfSpot:"green",users:[],gymLeader:7,row:1,col:11},
{typeOfSpot:"pokemon",colorOfSpot:"green",users:[],gymLeader:2,row:1,col:12},
{typeOfSpot:"pokemon",colorOfSpot:"green",users:[],gymLeader:2,row:1,col:13},
{typeOfSpot:"pokemon",colorOfSpot:"green",users:[],gymLeader:2,row:1,col:14},
{typeOfSpot:"city",colorOfSpot:"green",users:[],gymLeader:3,row:1,col:15},
{typeOfSpot:"city",colorOfSpot:"blue",users:[],gymLeader:0,row:2,col:16},
{typeOfSpot:"city",colorOfSpot:"blue",users:[],gymLeader:6,row:2,col:17},
{typeOfSpot:"pokemon",colorOfSpot:"blue",users:[],gymLeader:1,row:2,col:18},
{typeOfSpot:"city",colorOfSpot:"blue",users:[],gymLeader:4,row:2,col:19},
{typeOfSpot:"pokemon",colorOfSpot:"blue",users:[],gymLeader:4,row:2,col:0},
{typeOfSpot:"city",colorOfSpot:"blue",users:[],gymLeader:3,row:2,col:1},
{typeOfSpot:"event",colorOfSpot:"blue",users:[],gymLeader:4,row:2,col:2},
{typeOfSpot:"event",colorOfSpot:"blue",users:[],gymLeader:2,row:2,col:3},
{typeOfSpot:"pokemon",colorOfSpot:"blue",users:[],gymLeader:0,row:2,col:4},
{typeOfSpot:"event",colorOfSpot:"blue",users:[],gymLeader:4,row:2,col:5},
{typeOfSpot:"city",colorOfSpot:"blue",users:[],gymLeader:1,row:2,col:6},
{typeOfSpot:"pokemon",colorOfSpot:"blue",users:[],gymLeader:4,row:2,col:7},
{typeOfSpot:"city",colorOfSpot:"blue",users:[],gymLeader:3,row:2,col:8},
{typeOfSpot:"pokemon",colorOfSpot:"blue",users:[],gymLeader:4,row:2,col:9},
{typeOfSpot:"pokemon",colorOfSpot:"blue",users:[],gymLeader:7,row:2,col:10},
{typeOfSpot:"pokemon",colorOfSpot:"blue",users:[],gymLeader:2,row:2,col:11},
{typeOfSpot:"event",colorOfSpot:"blue",users:[],gymLeader:7,row:2,col:12},
{typeOfSpot:"city",colorOfSpot:"blue",users:[],gymLeader:0,row:2,col:13},
{typeOfSpot:"pokemon",colorOfSpot:"red",users:[],gymLeader:3,row:3,col:14},
{typeOfSpot:"city",colorOfSpot:"red",users:[],gymLeader:4,row:3,col:15},
{typeOfSpot:"city",colorOfSpot:"red",users:[],gymLeader:7,row:3,col:16},
{typeOfSpot:"city",colorOfSpot:"red",users:[],gymLeader:4,row:3,col:17},
{typeOfSpot:"pokemon",colorOfSpot:"red",users:[],gymLeader:6,row:3,col:18},
{typeOfSpot:"city",colorOfSpot:"red",users:[],gymLeader:2,row:3,col:19},
{typeOfSpot:"pokemon",colorOfSpot:"red",users:[],gymLeader:3,row:3,col:0},
{typeOfSpot:"pokemon",colorOfSpot:"red",users:[],gymLeader:4,row:3,col:1},
{typeOfSpot:"city",colorOfSpot:"red",users:[],gymLeader:2,row:3,col:2},
{typeOfSpot:"event",colorOfSpot:"red",users:[],gymLeader:0,row:3,col:3},
{typeOfSpot:"event",colorOfSpot:"red",users:[],gymLeader:6,row:3,col:4},
{typeOfSpot:"event",colorOfSpot:"red",users:[],gymLeader:3,row:3,col:5},
{typeOfSpot:"pokemon",colorOfSpot:"red",users:[],gymLeader:7,row:3,col:6},
{typeOfSpot:"pokemon",colorOfSpot:"red",users:[],gymLeader:4,row:3,col:7},
{typeOfSpot:"city",colorOfSpot:"red",users:[],gymLeader:7,row:3,col:8},
{typeOfSpot:"event",colorOfSpot:"red",users:[],gymLeader:5,row:3,col:9},
{typeOfSpot:"city",colorOfSpot:"red",users:[],gymLeader:1,row:3,col:10},
{typeOfSpot:"event",colorOfSpot:"red",users:[],gymLeader:4,row:3,col:11},
{typeOfSpot:"event",colorOfSpot:"red",users:[],gymLeader:7,row:3,col:12},
{typeOfSpot:"pokemon",colorOfSpot:"red",users:[],gymLeader:2,row:3,col:13},
];








.controller('boardController', function($scope, gameDashboardFactory) {
  $scope.hello = 'hello testing testing';
  $scope.playerOptions = [[1,2,3],[1,2,3,4]];
  $scope.gameId = 1;
  $scope.userId = 1;
  $scope.userPosition = 6;
  $scope.roll;

  $scope.rollDice = function() {
    $scope.roll = Math.ceil(Math.random() * 6);
    gameDashboardFactory.getPlayerOptions($scope.roll, $scope.userPosition, $scope.gameId, $scope.userId)
      .then(function(options){
        $scope.playerOptions[0] = options.forwardOptions;
        $scope.playerOptions[1] = options.backwardOptions;
      });
  };

  $scope.testPass = function(arg) {
    console.log('This is the gameboard spot object', arg);
  };



app.controller('boardController', function($scope, boardFactory) {
  $scope.init = function() {
    $scope.boardData = boardFactory.getBoard();
    // .then(function (resp) {
    //   $scope.boardData = resp;
    // }).catch(function(err) {
    //   console.error(err);
    // });
  };
  


  // $scope.boardData = [10,20,30,60,80,20,50];
  // $scope.input;
  // $scope.inputValue = function($event) {
  //   if($event.which === 13) {
  //     $scope.boardData[3] = $scope.input;
  //   console.log('Iget here', $scope.input, $scope.boardData);
  //   }
  // };

  $scope.init();

})

.factory('boardFactory', function($http) {

  // assume that this function retuns only the
  // game board
  var getBoard = function() {
    return fakeboard;
      // return $http({
    //   method: 'GET',
    //   url: '/games/' + gameId
    // })
    // .then(function(resp) {
    //   return resp.data;
    // });

  };

  return {
    getBoard: getBoard
  };
})

.directive('drawBoard',function() {
  var drawd3 = function(scope, element, attrs){
    var chart = d3.select(element[0]);
      chart.selectAll('*').remove();
      chart.append("div").attr("class", "chart")
       .selectAll('div')
       .data(scope.data).enter().append("div")
       .transition().ease("elastic")
       .style("width", function(d) { return d + "%"; })
       .text(function(d) { return d + "%"; });
  };

  var directiveObject = {
    restrict: 'E',
    replace: false,
    scope: {data: '=boardData'},
    link: function(scope, element, attrs) {
      drawd3(scope, element, attrs);
      scope.$watch('data', function(newValue, oldValue) {
        if(newValue) {
          drawd3(scope, element, attrs);
          console.log("A data change", attrs);
        }
      },true);
    }
  };
  return directiveObject;
});


