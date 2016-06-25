'use strict';

var app = angular.module('myApp');

app.service('User', function($http){
	

  this.addEmail = (email) => {

    this.email = email;
    console.log(email);

  };



  this.getAll = () => {
		return $http.get('/users');
	}
	this.addUser = () => {
		return $http.get('/users');
	}
})



app.service('Exchanges', function($http) {
	  
	this.getAll = () => {

		return $http.get('https://openexchangerates.org/api/latest.json?app_id='+'74f027b4142e443ab217bd7158238a20');
		
		}
})


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