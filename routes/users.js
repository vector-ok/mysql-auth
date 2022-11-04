var express = require('express');
const User = require('../models/user');
var router = express.Router();
const passport = require('passport');
const Helper = require('../utils/helper');
require('../config/passport')(passport);

const helper = new Helper();

router.post(
  '/',
  passport.authenticate('jwt', {
    session: false,
  }),
  function (req, res) {
    helper
      .checkPermission(req.user.role_id, 'user_add')
      .then((rolePerm) => {
        if (
          !req.body.role_id ||
          !req.body.email ||
          !req.body.password ||
          !req.body.fullname ||
          !req.body.phone
        ) {
          res.status(400).send({
            msg: 'Missing Role ID, email, fullname, password or phone',
          });
        } else {
          User.create({
            email: req.body.email,
            password: req.body.password,
            fullname: req.body.fullname,
            phone: req.body.phone,
            role_id: req.body.role_id,
          })
            .then((user) => {
              res.status(201).send(user);
            })
            .catch((error) => {
              console.log(error);
              res.status(400).send(error);
            });
        }
      })
      .catch((error) => {
        res.status(403).send(error);
      });
  }
);

// get list of users
router.get(
  '/',
  password.authenticate('jwt', {
    session: false,
  }),
  function (re, res) {
    helper
      .checkPermission(req.user.role_id, 'user-get_all')
      .then((rolePerm) => {
        User.findAll()
          .then((users) => {
            res.status(200).send(users);
          })
          .catch((error) => {
            res.status(400).send(error);
          });
      })
      .catch((error) => {
        res.status(403).send(error);
      });
  }
);

// get user by id
router.get(
  '/:id',
  passport.authenticate('jwt', {
    session: false,
  }),
  function (req, res) {
    helper
      .checkPermission(req.user.role_id, 'user_get')
      .then((rolePerm) => {
        User.findByPk(req.params.id)
          .then((user) => res.status(200).send(user))
          .catch((error) => {
            res.status(400).send(error);
          });
      })
      .catch((error) => res.status(403).send(error));
  }
);

// update a user
router.put(
  '/:id',
  passport.authenticate('jwt', {
    session: false,
  }),
  function (req, res) {
    helper
      .checkPermission(req.user.role_id, 'user_update')
      .then((rolePerm) => {
        if (
          !req.body.role_id ||
          !req.body.email ||
          !req.body.password ||
          !req.body.fullname ||
          !req.body.phone
        ) {
          res.status(400).send({
            msg: 'Missing Role ID, email, fullname, password or phone!',
          });
        } else {
          User.findByPk(req.params.id).then((user) => {
            User.update(
              {
                email: req.body.email || user.email,
                password: req.body.password || user.password,
                fullname: req.body.fullname || user.fullname,
                phone: req.body.phone || user.phone,
                role_id: req.body.role_id || user.role_id,
              },
              {
                where: {
                  id: req.params.id,
                },
              }
            )
              .then(() => {
                res.status(200).send({ msg: 'User updated!' });
              })
              .catch((err) => {
                res.status(400).send(err);
              });
          });
        }
      })
      .catch((error) => {
        res.status(403).send(error);
      });
  }
);

// delete a user
router.delete(
  '/:id',
  passport.authenticate('jwt', {
    session: false,
  }),
  function (req, res) {
    helper
      .checkPermission(req.user.role_id, 'user_delete')
      .then((rolePerm) => {
        if (!req.params.id) {
          res.status(400).send({ msg: 'Missing user ID' });
        } else {
          User.findByPk(req.params.id)
            .then((user) => {
              if (user) {
                User.destroy({
                  where: {
                    id: req.params.id,
                  },
                })
                  .then(() => {
                    res.status(200).send({ msg: 'user deleted!' });
                  })
                  .catch((err) => res.sendStatus(400).send(err));
              } else {
                res.status(404).send({ msg: 'User not found!' });
              }
            })
            .catch((error) => {
              res.status(400).send(error);
            });
        }
      })
      .catch((error) => {
        res.status(403).send(error);
      });
  }
);

module.exports = router;
