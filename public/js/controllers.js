'use strict';

var app = angular.module('myApp');

app.controller('mainCtrl', function($scope) {
  console.log('mainCtrl!');
});




app.controller('formpageCtrl', function($scope, $timeout, $q, $log,$http) {
  console.log('formpageCtrl!');

  var self = this;
  self.simulateQuery = false;
  self.isDisabled    = false;
  // list of `state` value/display objects
  self.states        = loadAll();
  self.querySearch   = querySearch;
  self.selectedItemChange = selectedItemChange;
  self.searchTextChange   = searchTextChange;
  self.newState = newState;
  function newState(state) {
    alert("Sorry! You'll need to create a Constituion for " + state + " first!");
  }
  // ******************************
  // Internal methods
  // ******************************
  /**
   * Search for states... use $timeout to simulate
   * remote dataservice call.
   */
  function querySearch (query) {
    console.log("query: ",query);
    var results = query ? self.states.filter( createFilterFor(query) ) : self.states,
        deferred;
    console.log("results: ",results);
    if (self.simulateQuery) {
      deferred = $q.defer();
      $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
      return deferred.promise;
    } else {
      return results;
    }
  }
  function searchTextChange(text) {
    $log.info('Text changed to ' + text);
  }
  function selectedItemChange(item) {
    $log.info('Item changed to ' + JSON.stringify(item));
  }
  /**
   * Build `states` list of key/value pairs
   */
   function loadAll() {
      var allStates = 'Hartsfield–Jackson Atlanta International Airport, Los Angeles International Airport,\
       O\'Hare International Airport, Dallas/Fort Worth International Airport, John F. Kennedy International Airport,\
        Beijing Capital International, London Heathrow, Tokyo International, Chicago O’Hare International, Los Angeles International,\
        Charles de Gaulle International, Dallas Fort Worth International, Soekarno-Hatta International, Dubai International';
      let iata = ['ATL', 'LAX', 'ORD', 'DFW', 'JFK', 'PEK', 'LHR', 'HND', 'ORD', 'LAX', 'CDG', 'DFW', 'CGK', 'DXB'];
      let output = allStates.split(/, +/g).map( (state, index) => {
        return {
          value: iata[index],
          display: state
          // iata:iata[index]
        };
      });
      console.log("output", output);
      return output;
    }
  //  function loadAll() {
  //    var allStates = 'Hartsfield–Jackson Atlanta International Airport, Los Angeles International Airport,\
  //     O\'Hare International Airport, Dallas/Fort Worth International Airport, John F. Kennedy International Airport,\
  //      Beijing Capital International, London Heathrow, Tokyo International, Chicago O’Hare International, Los Angeles International,\
  //      Charles de Gaulle International, Dallas Fort Worth International, Soekarno-Hatta International, Dubai International';
  //     let output = allStates.split(/, +/g).map( function (state) {
  //       return {
  //         value: state.toLowerCase(),
  //         display: state
  //       };
  //     });
  //     console.log(output);
  //     return output;
  //   }
  // function loadAll() {
  //   let allStates=[];
  //   $http.get('/depen/airports.json').then((res) => {
  //     console.log(res.data);
  //
  //
  //     res.data.forEach((elem) => {
  //       allStates.push({
  //         value: elem.iata.toLowerCase(),
  //       display: elem.name
  //     });
  //   })
  //       // debugger;
  //     console.log(allStates);
  //
  //   });
  //     return allStates;
  // }
  /**
   * Create filter function for a query string
   */
  function createFilterFor(query) {
    var lowercaseQuery = angular.lowercase(query);
    return function filterFn(state) {
      return (state.value.indexOf(lowercaseQuery) === 0);
    };
  }



});




app.controller('calculatorCtrl', function($scope) {
  console.log('calculatorCtrl!');




});
