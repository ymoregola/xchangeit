'use strict';

var app = angular.module('myApp');

app.controller('mainCtrl', function($scope, User, $state) {

  console.log('mainCtrl!');

  $scope.saveEmail = () => {

    User.addEmail($scope.email);
    $state.go('formpage');


  };







});




app.controller('formpageCtrl', function($scope, $timeout, $q, $log,$http, User,$state, SweetAlert) {
  // console.log('formpageCtrl!');
  // console.log($scope.newUser);
  $scope.isLoading=false;
  $scope.buttonText = 'Find Match';
  $scope.newUser = {};

  $scope.newUser.email = User.email;

  // console.log($scope.newUser);

  $scope.addUser = () => {
    // debugger;
    $scope.buttonText = '';
    $scope.isLoading = true;
    User.addUser($scope.newUser) 
      .then(res => {
        $scope.isLoading = false;
        $scope.buttonText = 'Find Match';
        // console.log(res);
        if(res.data.foundMatch) {
          SweetAlert.swal({
            title:"We found a match!",
            text: res.data.message, 
            type: "success"},
            function() {
              $state.go('calculator');
          });
          // alert(res.data.message);
          
        } else {
         SweetAlert.swal({
            title:"Information Submited!",
            text: res.data.message, 
            type: "success"},
            function() {
              $state.go('calculator');
          });
          // alert(res.data.message);
          // $state.go('calculator');
        }
        
      })

    
  }




///auto complete//////////////////
 var self = this;
  self.simulateQuery = false;
  self.isDisabled    = false;
  self.airports        = loadAll();
  self.querySearch   = querySearch;
  self.selectedItemChange = selectedItemChange;
  self.searchTextChange   = searchTextChange;
  self.newState = newState;
  function newState(state) {
    alert("Sorry! You'll need to create a Constituion for " + state + " first!");
  }

  function querySearch (query) {
    var results = query ? self.airports.filter( createFilterFor(query) ) : self.airports,
        deferred;
    // console.log("results: ",results);
    if (self.simulateQuery) {
      deferred = $q.defer();
      $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
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
      let iata = ['ATL', 'LAX', 'ORD', 'DFW', 'JFK', 'PEK', 'LHR', 'HND', 'ORD', 'LAX', 'CDG', 'DFW', 'CGK', 'DXB','FRA','HKG','DEN','BKK','SIN','MAD','ICN','AMS','SYD'];
      let output = allAirports.split(/, +/g).map( (airport, index) => {
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
      return (state.value.indexOf(lowercaseQuery) === 0);
    };
  }

});




app.controller('calculatorCtrl', function($scope, Exchanges, $state) {
  console.log('calculatorCtrl!');
  // console.log(fx);
  $scope.calculateRate = () => {
    Exchanges.getAll()
      .then(res => {
        if (typeof fx !== "undefined" && fx.rates) {
          fx.rates = res.data.rates;
          fx.base = res.data.base;
        } else {
          // If not, apply to fxSetup global:
          var fxSetup = {
            rates: res.data.rates,
            base: res.data.base
          }
        }
        $scope.showExchangeRateP1 = (fx.convert(1.00, { from: $scope.baseCurrency, to: $scope.wantedCurrency }));
        $scope.showExchangeRate = (fx.convert(parseInt($scope.amountToTrade), { from: $scope.baseCurrency, to: $scope.wantedCurrency }));

      });
    console.log('Exchanges', Exchanges);

    // console.log('outt',fx.convert(12.99, {from: "GBP", to: "HKD"}));
  };


});




