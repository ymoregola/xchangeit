'use strict'

const db = require('../config/db');
const uuid = require('uuid');
const moment = require('moment');
const oxr = require('open-exchange-rates');
const fx = require('money');
const request = require('request');
var helper = require('sendgrid').mail;
var sg = require('sendgrid').SendGrid(process.env.SENDGRID_API_KEY);

console.log('send apikey:', process.env.SENDGRID_API_KEY);

//conversion setup
oxr.set({ app_id: '74f027b4142e443ab217bd7158238a20' });
oxr.latest(function() {
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
  return new Promise((resolve, reject) => {
    db.query('select * from users', (err, users) => {
      if (err) {
        reject(err);
      } else {
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
  let maxAmount = userObject.maxAmount;

  //convert min and max amount to USD
  userObject.minAmount = fx(minAmount).from(userObject.currentCur).to('USD');
  userObject.maxAmount = fx(maxAmount).from(userObject.currentCur).to('USD');
  console.log("userObject: ", userObject);
  return new Promise((resolve, reject) => {
    db.query('insert into users set ?', userObject, (err, users) => {
      if (err) return reject(err);

      //Search the database to see if there are any matches
      db.query(`SELECT * FROM users WHERE (currentCur = ? AND wantedCur = ? AND airport = ? AND
       ((minAmount BETWEEN (?-100) AND (?+100)) OR (maxAmount BETWEEN (?-100) AND (?+100))))`, [userObject.wantedCur, userObject.currentCur, userObject.airport, userObject.minAmount,
        userObject.minAmount, userObject.maxAmount, userObject.maxAmount
      ], (err, matches) => {
        if (err) {
          reject(err);
        } else {
          console.log('matches:', matches);
          // let results = {
          //   matches: matches,
          //   original: userObject
          // };

          //send the email to the most
          if (matches.length > 0) {
            sendEmailFoundMatch(matches, userObject, function(response) {

              // if (err) {
              //   reject(err);
              // } else {
              console.log('mailgrid:', response);
              let output = {
                foundMatch: true,
                message: `We found you a match! Check your email for more details.

                          In the meantime, click OK to be redirected to our currency conversion calculator.        `
              };
              resolve(output);
              // }

            });
          } else {
            sendConfirmation(userObject, function(response) {

              // if (err) {
              //   reject(err);
              // } else {
              console.log('confirmation:', response);
              //resolve(response);
              // }
              let output = {
                foundMatch: false,
                message: `No matches found yet, we will email you when we find a match. 

                          In the meantime, click OK to be redirected to our currency conversion calculator.   

              P.S. We send you an email confirming your inqury.`
              };
              resolve(output);

            });
          }


          // .then(emailResult => {
          //   resolve(emailResult);
          // }).catch(err => {
          //   reject(err);
          // })

          // resolve(results);
        }
      });
    });
  });
}

exports.deleteUser = id => {
  return new Promise((resolve, reject) => {
    db.query(`delete from users where id = "${id}"`, (err, users) => {
      if (err) return reject(err);
      resolve();
    });
  });
};



function sendEmailFoundMatch(matches, originalUser, cb) {
  console.log('in send email');

  // let from_email = new helper.Email("me@thomaswolfe.me");
  // let to_email1 = new helper.Email("tewolfe2@gmail.com");
  // let to_email2 = new helper.Email("somtida.th@gmail.com");
  // let subject = "Hello World from the SendGrid Node.js Library";
  // let content = new helper.Content("text/plain", "some text here");
  // let mail = new helper.Mail(from_email, subject, to_email1, content);
  // var requestBody = mail.toJSON();
  // console.log('requestBody:',requestBody.personalizations[0]);
  // var request = sg.emptyRequest();
  // request.method = 'POST';
  // request.path = '/v3/mail/send';
  // request.body = requestBody;
  // sg.API(request, cb);


let arr = originalUser.id.split('');
let URL = 'https://tlk.io/' + arr.splice(0,30).join('');

  var request = sg.emptyRequest();
  request.body = {
    "content": [{
      "type": "text/html",
      "value": `<html><h2>You have been matched, Congrats! </h2><br>
      <p> Go <a href=${URL}>here</a> to start chatting with your match.
      </html>`
    }],
    "from": {
      "email": "me@thomaswolfe.me",
      "name": "XchangeIt"
    },
    "headers": {},
    "mail_settings": {
      "bcc": {
        "email": "somtida.th@gmail.com",
        "enable": true
      },
      "bypass_list_management": {
        "enable": true
      },
      "footer": {
        "enable": true,
        "html": "<p>Thanks,<br>The XchangeIt Team</p>"
      }
    },
    "personalizations": [{
      "bcc": [
        {
          "email": matches[0].email
        }
      ],
      "cc": [{
        "email": "ymoregola@gmail.com",
        "name": "Yanick"
      }],
      "headers": {
        "X-Accept-Language": "en",
        "X-Mailer": "MyApp"
      },
      "send_at": 1409348513,
      "subject": "You have been matched!",
      "substitutions": {
        "id": "substitutions",
        "type": "object"
      },
      "to": [{
        "email": originalUser.email,
        "name": ""
      }]
    }]
  }
  request.method = 'POST';
  request.path = '/v3/mail/send';
  sg.API(request, cb);

};


function sendConfirmation(userObject,cb) {

  var request = sg.emptyRequest();
  request.body = {
    "content": [{
      "type": "text/html",
      "value": `<html><h2>We have recieved your request</h2>
      <p>We will email you when we find someone who has <b>${userObject.wantedCur}</b> 
      and is looking for <b>${userObject.currentCur}</b> at <b>${userObject.airport}</b>.</p>
      </html>`
    }],
    "from": {
      "email": "me@thomaswolfe.me",
      "name": "XchangeIt"
    },
    "headers": {},
    "mail_settings": {
      
      "bypass_list_management": {
        "enable": true
      },
      "footer": {
        "enable": true,
        "html": "<p>Thanks,<br>The XchangeIt Team</p>"
      }
    },
    "personalizations": [{
    
      "headers": {
        "X-Accept-Language": "en",
        "X-Mailer": "MyApp"
      },
      "send_at": 1409348513,
      "subject": "Hello, welcome to XchangeIt!",
      // "substitutions": {
      //   "id": "substitutions",
      //   "type": "object"
      // },
      "to": [{
        "email": userObject.email,
        "name": ""
      }]
    }]
  }
  request.method = 'POST';
  request.path = '/v3/mail/send';
  sg.API(request, cb);

};


// let arr = userObject.uuid.split('');
// let url = 'https://tlk.io/' + arr.splice(30,36).join('');



// exports.updateUser =  => {
//   return new Promise((resolve, reject) => {
//     db.query(`update users set email = "${userObject.email}"`, (err, users) => {
//       if(err) return reject(err);
//       resolve();
//     })
//   })
// }
