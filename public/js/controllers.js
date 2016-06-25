'use strict';

var app = angular.module('myApp');

app.controller('mainCtrl', function($scope, User, $state) {

  console.log('mainCtrl!');

  $scope.saveEmail = () => {

    User.addEmail($scope.email);
    $state.go('formpage');


  };







});




app.controller('formpageCtrl', function($scope, User,$state) {
  // console.log('formpageCtrl!');
  // console.log($scope.newUser);
  $scope.newUser = {};
  $scope.newUser.email = User.email;

  console.log($scope.newUser);

  $scope.addUser = () => {
    User.addUser($scope.newUser) 
      .then(res => {
        // console.log(res);
        if(res.data.foundMatch) {
          alert(res.data.message);
          $state.go('calculator');
        } else {
          alert(res.data.message);
          $state.go('calculator');
        }
        
      })

    
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
