'use strict';

<<<<<<< HEAD
var app = angular.module('myApp', ['ui.router', 'ngMaterial']);
=======
var app = angular.module('myApp', ['ui.router','oitozero.ngSweetAlert']);
>>>>>>> ca3be84eda1c999a212ca8c8b1e9a0f0907cb4a7

app.config(function($stateProvider, $urlRouterProvider) {

	$stateProvider

	.state('home', {
		url: '/',
		templateUrl: '/html/home.html',
		controller: 'mainCtrl'
	})


	.state('formpage', {
		url: '/formpage',
		templateUrl: '/html/formpage.html',
		controller: 'formpageCtrl  as ctrl'
	})

	.state('calculator', {
		url: '/calculator',
		templateUrl: '/html/calculator.html',
		controller: 'calculatorCtrl'
	})
	.state('chat', {
		url: '/chat/:chatId',
		templateUrl: '/html/chat.html',
		controller: 'chatController'
	})


	$urlRouterProvider.otherwise('/');
});
