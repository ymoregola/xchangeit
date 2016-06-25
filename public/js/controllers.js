'use strict';

var app = angular.module('myApp');

app.controller('mainCtrl', function($scope) {
	console.log('mainCtrl!');
    		// console.log(fx);
    	});




app.controller('formpageCtrl', function($scope) {
	console.log('formpageCtrl!');


});




app.controller('calculatorCtrl', function($scope, Exchanges, $state) {
	console.log('calculatorCtrl!');
    		// console.log(fx);
    		$scope.calculateRate = () => {
    			Exchanges.getAll()
    			.then(res => {
    				if ( typeof fx !== "undefined" && fx.rates ) {
    					fx.rates = res.data.rates;
    					fx.base = res.data.base;
    				} else {
	              // If not, apply to fxSetup global:
	              var fxSetup = {
	              	rates : res.data.rates,
	              	base : res.data.base
	              }
	            }
	            $scope.showExchangeRateP1 = (fx.convert(1.00, {from: $scope.baseCurrency, to: $scope.wantedCurrency}));
	            $scope.showExchangeRate = (fx.convert(parseInt($scope.amountToTrade), {from: $scope.baseCurrency, to: $scope.wantedCurrency}));

	          });
    			console.log('Exchanges', Exchanges);

// console.log('outt',fx.convert(12.99, {from: "GBP", to: "HKD"}));
};


});



