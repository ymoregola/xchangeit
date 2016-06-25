'use strict'



const db = require('../config/db');
const uuid = require('uuid');
const moment = require('moment');



db.query(`CREATE TABLE IF NOT EXISTS transactions(
  id TEXT,
  date TEXT,
  airport TEXT,
  currentCur NUMERIC(15,2),
  wantedCur NUMERIC(15,2),
  minAmount NUMERIC(15,2),
  maxAmount  NUMERIC(15,2),
  createdAt TEXT, 
  email TEXT
  )`);


exports.getAll = () => {


  return new Promise((resolve,reject) => {




  })
    
}