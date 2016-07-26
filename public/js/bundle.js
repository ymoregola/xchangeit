'use strict';

var app = angular.module('myApp', ['ui.router', 'oitozero.ngSweetAlert', 'ngMaterial', 'isoCurrency']);

app.config(function ($stateProvider, $urlRouterProvider) {

  $stateProvider.state('home', {
    url: '/',
    templateUrl: '/html/home.html',
    controller: 'mainCtrl'
  }).state('formpage', {
    url: '/formpage',
    templateUrl: '/html/formpage.html',
    controller: 'formpageCtrl as ctrl'
  }).state('calculator', {
    url: '/calculator',
    templateUrl: '/html/calculator.html',
    controller: 'calculatorCtrl'
  }).state('chat', {
    url: '/chat/:chatId',
    templateUrl: '/html/chat.html',
    controller: 'chatController'
  });

  $urlRouterProvider.otherwise('/');
});

'use strict';

var app = angular.module('myApp');

app.controller('mainCtrl', function ($scope, User, $state) {

  console.log('mainCtrl!');

  $scope.saveEmail = function () {

    User.addEmail($scope.email);
    $state.go('formpage');
  };
});

app.controller('formpageCtrl', function ($scope, $timeout, $q, $log, $http, User, $state, SweetAlert) {
  // console.log('formpageCtrl!');
  // console.log($scope.newUser);
  $scope.isLoading = false;
  $scope.buttonText = 'Find Match';
  $scope.newUser = {};

  $scope.newUser.email = User.email;

  // console.log($scope.newUser);

  $scope.addUser = function () {
    // debugger;
    $scope.buttonText = '';
    $scope.isLoading = true;
    User.addUser($scope.newUser).then(function (res) {
      $scope.isLoading = false;
      $scope.buttonText = 'Find Match';
      // console.log(res);
      if (res.data.foundMatch) {
        SweetAlert.swal({
          title: "We found a match!",
          text: res.data.message,
          type: "success" }, function () {
          $state.go('calculator');
        });
        // alert(res.data.message);
      } else {
        SweetAlert.swal({
          title: "Information Submited!",
          text: res.data.message,
          type: "success" }, function () {
          $state.go('calculator');
        });
        // alert(res.data.message);
        // $state.go('calculator');
      }
    });
  };

  ///auto complete//////////////////
  var self = this;
  self.simulateQuery = false;
  self.isDisabled = false;
  self.airports = loadAll();
  self.querySearch = querySearch;
  self.selectedItemChange = selectedItemChange;
  self.searchTextChange = searchTextChange;
  self.newState = newState;
  function newState(state) {
    alert("Sorry! You'll need to create a Constituion for " + state + " first!");
  }

  function querySearch(query) {
    var results = query ? self.airports.filter(createFilterFor(query)) : self.airports,
        deferred;
    // console.log("results: ",results);
    if (self.simulateQuery) {
      deferred = $q.defer();
      $timeout(function () {
        deferred.resolve(results);
      }, Math.random() * 1000, false);
      return deferred.promise;
    } else {
      return results;
    }
  }
  function searchTextChange(text) {
    // $log.info('Text changed to ' + text);
  }
  function selectedItemChange(item) {
    // $log.info('Item changed to ' + JSON.stringify(item));
    // debugger;
    $scope.newUser.airport = item.iata;
  }

  function loadAll() {
    var allAirports = 'Hartsfield–Jackson Atlanta International Airport, Los Angeles International Airport,\
       O\'Hare International Airport, Dallas/Fort Worth International Airport, John F. Kennedy International Airport,\
        Beijing Capital International, London Heathrow, Tokyo International, Chicago O’Hare International, Los Angeles International,\
        Charles de Gaulle International, Dallas Fort Worth International, Soekarno-Hatta International, Dubai International, Frankfurt am Main International,\
        Hong Kong International Kai Tak, Denver International, Thailand Suvarnabhumi, Singapore Changi International, Madrid Barajas International, Incheon International, Amsterdam Schiphol,\
        Sydney Kingsford Smith International';
    var iata = ['ATL', 'LAX', 'ORD', 'DFW', 'JFK', 'PEK', 'LHR', 'HND', 'ORD', 'LAX', 'CDG', 'DFW', 'CGK', 'DXB', 'FRA', 'HKG', 'DEN', 'BKK', 'SIN', 'MAD', 'ICN', 'AMS', 'SYD'];
    var output = allAirports.split(/, +/g).map(function (airport, index) {
      return {
        value: airport.toLowerCase(),
        iata: iata[index],
        display: airport
      };
    });
    // console.log("output", output);
    return output;
  }

  function createFilterFor(query) {
    var lowercaseQuery = angular.lowercase(query);
    return function filterFn(state) {
      return state.value.indexOf(lowercaseQuery) === 0;
    };
  }
});

app.controller('calculatorCtrl', function ($scope, Exchanges, $state) {
  console.log('calculatorCtrl!');
  // console.log(fx);
  $scope.calculateRate = function () {

    Exchanges.getAll().then(function (res) {
      if (typeof fx !== "undefined" && fx.rates) {
        fx.rates = res.data.rates;
        fx.base = res.data.base;
      } else {
        // If not, apply to fxSetup global:
        var fxSetup = {
          rates: res.data.rates,
          base: res.data.base
        };
      }
      $scope.showExchangeRateP1 = angular.copy(fx.convert(1.00, { from: $scope.baseCurrency, to: $scope.wantedCurrency }));
      $scope.showExchangeRate = angular.copy(fx.convert(parseInt($scope.amountToTrade), { from: $scope.baseCurrency, to: $scope.wantedCurrency }));
      $scope.base = $scope.baseCurrency;
      $scope.wanted = $scope.wantedCurrency;
      // $scope.wantedCurrency ='';
      // $scope.baseCurrency='';
    });
    console.log('Exchanges', Exchanges);

    // console.log('outt',fx.convert(12.99, {from: "GBP", to: "HKD"}));
  };
});

'use strict';

var app = angular.module('myApp');

app.service('User', function ($http) {
  var _this = this;

  this.addEmail = function (email) {

    _this.email = email;
    console.log(email);
  };

  //  this.getAll = () => {
  // 	return $http.get('/users');
  // }
  this.addUser = function (userObj) {
    console.log(userObj);

    return $http.post('/users', userObj).catch(function (err) {
      console.log(err);
    });
  };
});

app.service('Exchanges', function ($http) {

  this.getAll = function () {

    return $http.get('https://openexchangerates.org/api/latest.json?app_id=' + '74f027b4142e443ab217bd7158238a20');
  };
});

//  // Load exchange rates data via AJAX:
//  $.getJSON(
// // NB: using Open Exchange Rates here, but you can use any source!
// 'https://openexchangerates.org/api/latest.json?app_id='+'74f027b4142e443ab217bd7158238a20',
// function(data) {
//        // Check money.js has finished loading:
//        if ( typeof fx !== "undefined" && fx.rates ) {
//        	fx.rates = data.rates;
//        	fx.base = data.base;
//        } else {
//            // If not, apply to fxSetup global:
//            var fxSetup = {
//            	rates : data.rates,
//            	base : data.base
//            }
//          }
//        }
//        );