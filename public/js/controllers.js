'use strict';



var app = angular.module('myApp');


app.controller('mainCtrl', function($scope, Users) {
  console.log('hello!');

  Users.getAll()
    .then(res => {
      $scope.users = res.data;
    })
    .catch(err => {
      console.log("err: ",err);
    })
});
