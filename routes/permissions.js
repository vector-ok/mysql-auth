var express = require('express');
const Permission = require('../models/permission');
var router = express.Router();
const passport = require('passport');
const Helper = require('../utils/helper');
require('../config/passport')(passport);

const helper = Helper();

// create new Permission
router.post(
  '/',
  passport.authenticate('jwt', {
    session: false,
  }),
  function (req, res) {
    helper
      .checkPermission(req.user.role_id, 'permission_add')
      .then((rolePerm) => {
        if (!req.body.perm_name || !req.body.perm_description) {
          res.status(400).send({
            msg: 'Missing permission Name or Description!',
          });
        } else {
          Permission.create({
            perm_name: req.body.perm_name,
            perm_description: req.body.perm_description,
          })
            .then((perm) => {
              res.status(201).send(perm);
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

// get list of permissions
router.get(
  '/',
  passport.authenticate('jwt', {
    session: false,
  }),
  function (req, res) {
    helper
      .checkPermission(req.user.role_id, 'permissions_get_all')
      .then((rolePerm) => {
        Permission.findAll()
          .then((perms) => res.status(200).send(perms))
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(403).send(error));
  }
);

// update a Permission
router.put(
  '/:id',
  passport.authenticate('jwt', {
    session: false,
  }),
  function (req, res) {
    helper
      .checkPermission(req.user.role_id, 'permissions_update')
      .then((rolePerm) => {
        if (
          !req.params.id ||
          !req.body.perm_name ||
          !req.body.perm_description
        ) {
          res.status(400).send({
            msg: 'Missing permission ID, name or description!',
          });
        } else {
          Permission.findByPk(req.params.id)
            .then((perm) => {
              Permission.update(
                {
                  perm_name: req.body.perm_name || perm.perm_name,
                  perm_description:
                    req.body.perm_description || perm.perm_description,
                },
                {
                  where: {
                    id: req.params.id,
                  },
                }
              )
                .then(() => {
                  res.status(200).send({ msg: 'Permission updated!' });
                })
                .catch((err) => {
                  res.status(400).send(err);
                });
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

// delete a Permission
router.delete(
  '/:id',
  passport.authenticate('jwt', {
    session: false,
  }),
  function (req, res) {
    helper
      .checkPermission(req.user.role_id, 'permission_delete')
      .then((rolePerm) => {
        if (!req.params.id) {
          res.status(400).send({ msg: 'Missing permission ID' });
        } else {
          Permission.findByPk(req.params.id)
            .then((perm) => {
              if (perm) {
                Permission.destroy({
                  where: {
                    id: req.params.id,
                  },
                })
                  .then(() => {
                    res.status(200).send({ msg: 'Permission deleted!' });
                  })
                  .catch((err) => res.sendStatus(400).send(err));
              } else {
                res.status(404).send({ msg: 'Permission not found!' });
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
