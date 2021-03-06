'use strict';

var app = angular.module('myApp', ['ui.router','oitozero.ngSweetAlert','ngMaterial','isoCurrency']);

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
		controller: 'formpageCtrl as ctrl' 
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
