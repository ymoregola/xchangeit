'use strict';

var app = angular.module('myApp');

app.service('Users', function($http){
  this.getAll = () => {
    return $http.get('/users');
  }
  this.addUser = () => {
    return $http.get('/users');
  }
})
