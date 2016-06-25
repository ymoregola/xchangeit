'use strict';

const express = require('express');

let router = express.Router();

let User = require('../models/user');


router.get('/', (req, res) => {
  console.log("hello world!");
  User.getAll()
    .then(users => {
      console.log("users: ",users);
      res.send(users);
    })
    .catch(err => {
      res.status(400).send(err);
    })
})

router.post('/', (req, res) => {
  User.addUser(req.body)
    .then((results) => {
      res.send(results);
    })
    .catch(err => {
      res.status(400).send(err);
    })
})

router.delete('/:id', (req, res) => {
  User.deleteUser(id)
    .then(() => {
      res.send();
    })
    .catch(err => {
      res.status(400).send(err);
    })
})

// router.put('/:id', (req, res) => {
//   User.updateUser(id)
//     .then(() => {
//       res.send();
//     })
//     .catch(err => {
//       res.status(400).send(err);
//     })
// })





module.exports = router;
