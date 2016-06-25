'use strict'



const db = require('../config/db');
const uuid = require('uuid');
const moment = require('moment');

// db.query('drop table if exists users');

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
  console.log("userObject: ",userObject);
  return new Promise((resolve, reject) => {
    db.query('insert into users set ?', userObject, (err, users) => {
      if(err) return reject(err);

      db.query(`SELECT * FROM users WHERE (currentCur = ? AND wantedCur = ? AND airport = ? AND
       ((minAmount BETWEEN (?-100) AND (?+100)) OR (maxAmount BETWEEN (?-100) AND (?+100))))`
        ,[userObject.wantedCur,userObject.currentCur,userObject.airport,userObject.minAmount,
        userObject.minAmount,userObject.maxAmount,userObject.maxAmount], (err,matches) => {
        if(err) {
          reject(err);
        }else {
          console.log('matches:',matches);
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
