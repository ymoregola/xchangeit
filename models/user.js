'use strict'



const db = require('../config/db');
const uuid = require('uuid');
const moment = require('moment');
const oxr = require('open-exchange-rates');
const fx = require('money');

//conversion setup
oxr.set({app_id:'74f027b4142e443ab217bd7158238a20'});
oxr.latest( function() {
  fx.rates = oxr.rates;
  fx.base = oxr.base;
});

// db.query('drop table if exists users');

//min and max amount will be stored in the database as USD
db.query(`CREATE TABLE IF NOT EXISTS users(
  id VARCHAR(100),
  date VARCHAR(100),
  airport VARCHAR(100),
  currentCur VARCHAR(100),
  wantedCur VARCHAR(100),
  minAmount NUMERIC(15,2),
  maxAmount  NUMERIC(15,2),
  createdAt VARCHAR(100),
  email VARCHAR(100)
  )`);


exports.getAll = () => {
  return new Promise((resolve,reject) => {
    db.query('select * from users', (err, users) => {
      if(err){
        reject(err);
      }else{
        console.log(users);
        resolve(users);
      }
    });
  });

}

//add a new user and check to see if they match with any users already in the database
exports.addUser = userObject => {
  userObject.id = uuid();
  userObject.createdAt = moment().toISOString();
  let minAmount = userObject.minAmount;
  let maxAmount = userObject. maxAmount;

  //convert min and max amount to USD
  userObject.minAmount = fx(minAmount).from(userObject.currentCur).to('USD');
  userObject.maxAmount = fx(maxAmount).from(userObject.currentCur).to('USD');
  console.log("userObject: ",userObject);
  return new Promise((resolve, reject) => {
    db.query('insert into users set ?', userObject, (err, users) => {
      if(err) return reject(err);

      //Search the database to see if there are any matches
      db.query(`SELECT * FROM users WHERE (currentCur = ? AND wantedCur = ? AND airport = ? AND
       ((minAmount BETWEEN (?-100) AND (?+100)) OR (maxAmount BETWEEN (?-100) AND (?+100))))`
        ,[userObject.wantedCur,userObject.currentCur,userObject.airport,userObject.minAmount,
        userObject.minAmount,userObject.maxAmount,userObject.maxAmount], (err,matches) => {
        if(err) {
          reject(err);
        }else {
          console.log('matches:',matches);
          let results = 
          resolve(matches);
        }
      })

      resolve();
    });
  });
}

exports.deleteUser = id => {
  return new Promise((resolve, reject) => {
    db.query(`delete from users where id = "${id}"`, (err, users) => {
      if(err) return reject(err);
      resolve();
    });
  });
}


// exports.updateUser =  => {
//   return new Promise((resolve, reject) => {
//     db.query(`update users set email = "${userObject.email}"`, (err, users) => {
//       if(err) return reject(err);
//       resolve();
//     })
//   })
// }
