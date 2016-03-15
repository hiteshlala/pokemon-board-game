var app = angular.module('pokemon.board',[]);

app.controller('boardController', function($scope, gameDashboardFactory, boardFactory) {
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

  $scope.init = function() {
    // $scope.boardData = boardFactory.getBoard();
  };
  
 // boardData will have to be preprocessed to be an array or change how
 // we store it.  Might be easier to just store as an array
 $scope.boardData = gameBoard;
 $scope.pathData = path;
 $scope.playerPosition = 3;
 $scope.playerList = [];
 $scope.turn = 'player name or player index number';
 $scope.playerName = 'get after log in get this for board view?'

  $scope.input;
  $scope.inputValue = function($event) {
    if($event.which === 13) {
      // $scope.boardData[3] = $scope.input;
      // $scope.doublea[1][3] = $scope.input;
      // $scope.boardData[3]['colorOfSpot'] = $scope.input;
      // $scope.boardData[0].users.push($scope.input);
      $scope.playerPosition = $scope.input;
      $scope.input = '';
    }
  };

  $scope.input2;
  $scope.testDirective = function(data) {
    console.log('testDirective', data, $scope.pathData);
    // if($event.which === 13) {
    //   console.log('test directive',$scope.input2);
    //   // $scope.playerPosition = $scope.input2;
    //   $scope.input2 = "";
    // }
  };

  // $scope.init();
});

// was first iteration using an example given
app.directive('drawBoard',function() {
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

// this was second iteration
app.directive('drawNode', function() {

  // this draws the node on the canvas
  var drawNode = function(scope, element, attrs) {
    // decide on dimensions of svg canvas and figure out
    // multipliers
    // have to figure out how to get his info from the
    // document itself to allow resizing
    var width = 1200;
    var height= 800;
    var wfactor = width/20;
    var hfactor = height/4.3;
    // select node on html where we will be adding board 
    // using d3
    var board = d3.select(element[0])
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    board.selectAll('.dontexistyet')
      .append('circle')
      .data(scope.data)
      .enter()
      .append('circle')
      .transition().ease('elastic')
      .attr('r', 15)
      .attr('fill', function(d){return d.colorOfSpot;})
      .attr('cx', function(d){return 50 + d.col * wfactor;})
      .attr('cy', function(d){return 50 + d.row * hfactor;});
  };

  var directiveObject = {
    restrict: 'E',
    replace: false,
    scope: {data: '=nodeData'},
    link: function(scope, element, attrs) {
      drawNode(scope, element, attrs);
      console.log('from link function scope=',scope.data);

      scope.$watch('data', function(newValue, oldValue) {
        if(newValue) {
          drawNode(scope, element, attrs);
          console.log("A data change", newValue, oldValue);
        }
      }, true);

    }
  };
  return directiveObject;

});

app.factory('boardFactory', function($http) {

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

  // draw player on board
  var drawPlayer = function() {

  };

  // move player
  var movePlayer = function() {

  };

  return {
    getBoard: getBoard
  };
});

// third iteration using template
// most functionality we need done in this example
app.directive('drawSpot', function() {
  var directiveObject = {
    templateNamespace: 'svg',
    restrict: 'E',
    replace: true,
    scope: {data: '=nodeData'},
    template: function() {
        return '<circle ng-attr-cx="{{50+data.col*70}}" ng-attr-cy="{{50+data.row*50}}"'+
          ' r=12 fill={{data.colorOfSpot}} data-node={{data}}/>';
    },

    link: function(scope, element1, attrs) {

      if(scope.data.users.length > 0) {
        for (var i = 0; i < scope.data.users.length; i++) {
          var newTag = angular.element('<write-name data='+scope.data.users[i]+'>'+scope.data.users[i]+'</write-name>');
          angular.element(element1[0]).after(newTag);
        }



        // var domElementToAdd = '<text xmlns="http://www.w3.org/2000/svg" ng-attr-x="300" ng-attr-y="120" fill="red">angular append</text>';

        // // '<svg xmlns="http://www.w3.org/2000/svg"><text fill="green" x="4" y="20" font-weight="bolder" font-size="2" font-family="Arial">89</text></svg>',

        // var textTag = angular.element(domElementToAdd);
        // console.log('have players textTag', textTag);
        // angular.element(element1[0]).after(textTag);


        // $(element1[0]).empty();
        // var newText = document.createElementNS('http://www.w3.org/2000/svg','text');
        // newText.setAttribute('id','line2');
        // newText.setAttribute('ng-attr-x','300');
        // newText.setAttribute('ng-attr-y','120');
        // newText.setAttribute('fill','red');
        // newText.setAttribute('value','say something different');

        // var something = $(element1[0]).after(newText);
          // .data(scope.data.users).enter().append('text')
          // .text(scope.data.users[i]);

      //   // <text x="0" y="15" fill="red">I love SVG!</text>
      // console.log("from if in link", something);
      }

      element1.on('mouseenter', function(event) {
        console.log('from mousenter scope.data:', scope.data.colorOfSpot );
        console.log('from mousenter attrs.fill:', attrs.fill );
        // figure out angular pop up box populate with data
        // 
        // 
        element1.attr('fill', 'pink');
      });

      element1.on('mouseleave', function(event) {
        // do other stuff
        element1.attr('fill', scope.data.colorOfSpot);
      });

      // since populating through angular do not need to set watch
      // scope.$watch('data', function(newValue, oldValue) {
      //   if(newValue) {
      //     console.log("A data change", attrs);
      //   }
      // },true);

    }
  };
  return directiveObject;

});

app.directive('drawPath', function() {
  var directiveObject = {
    templateNamespace: 'svg',
    restrict: 'E',
    replace: true,
    scope: {path: '=pathArray'},
    template: function(){
      var coords = path.map(function(xypair){
        return xypair[0] + ',' + xypair[1];
      });
      var out = '<path d="M' + coords.join('L') + '" stroke="#795548" stroke-width=3 fill="none"></path>';
      return out;
    }
  };
  return directiveObject;
});

app.directive('writeName', function() {
  return {
    templateNamespace: 'svg',
    restrict: 'E',
    replace: true,
    scope: {data: '=data'},
    template: '<text ng-attr-x="{{50+data.col*70}}" '+
      'ng-attr-y="{{50+data.col*50}}" fill="#00BCD4">{{data.users}}</text>'
  };
});

app.directive('drawPlayer', function($animate) {
  return {
    templateNamespace: 'svg',
    restrict: 'E',
    replace: true,
    scope: {
      player: '=player',
      position: '=position',
      board: '=board'
    },
    template: function() {
      var x = '{{50+board[position].col*70}}';
      var y = '{{70+board[position].row*50}}';
      var r = '18';
      var fillOpacity = '.9';
      var fillColor = 'beige';
      var stroke = 'black';
      var strokeWidth = '1';
      return '<circle ng-attr-cx="'+ x +'" ng-attr-cy="'+ y +'"'+
                ' r="'+r+'" fill="'+ fillColor+'" fill-opacity="'+
                fillOpacity +'" stroke="'+ stroke +
                '" stroke-width="'+ strokeWidth +'"/>';
                
    },
    link: function(scope, element1, attrs) {
      element1.on('mouseover', function(event) {
        // do stuff
        console.log('mouse on player');
      });
      element1.on('mouseleave', function(event) {
        // do stuff
        console.log("mouse not on player");
      });
    }
  };
});

// for testing if a directive can change scope variables
app.directive('testEntry', function() {
  return {
    // templateNamespace: 'svg',
    restrict: 'E',
    replace: true,
    scope: {
      // player: '=player',
      // position: '=position',
      data: '=input2',
      eventHandler: '&ngClick'
    },

    template: function(scope, two, three, four) {
      console.log('from directive', scope, two, three, four);
      return '<div>'+'<input type="text"/>'+
        '<input type="button" data-ng-click="eventHandler(data)">hello</input>'+
        '</div>';
    }
  };
});