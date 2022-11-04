var express = require('express');
const Role = require('../models/role');
const Permission = require('../models/permission');
var router = express.Router();
const passport = require('passport');
const Helper = require('../utils/helper');
require('../config/passport')(passport);

const helper = Helper();

// create new Role
router.post(
  '/',
  passport.authenticate('jwt', {
    session: false,
  }),
  function (req, res) {
    helper
      .checkPermission(req.user.role_id, 'role_add')
      .then((rolePerm) => {
        if (!req.body.role_name || !req.body.role_description) {
          res.status(400).send({
            msg: 'Missing role Name or Description!',
          });
        } else {
          Role.create({
            role_name: req.body.role_name,
            role_description: req.body.role_description,
          })
            .then((role) => {
              res.status(201).send(role);
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

// get list of roles
router.get(
  '/',
  passport.authenticate('jwt', {
    session: false,
  }),
  function (req, res) {
    helper
      .checkPermission(req.user.role_id, 'role_get_all')
      .then((rolePerm) => {
        Role.findAll({
          include: [
            {
              model: Permission,
              as: 'permissions',
            },
            {
              model: 'User',
              as: 'users',
            },
          ],
        })
          .then((roles) => res.status(200).send(roles))
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(403).send(error));
  }
);

// get role by id
router.get(
  '/:id',
  passport.authenticate('jwt', {
    session: false,
  }),
  function (req, res) {
    helper
      .checkPermission(req.user.role_id, 'role_get')
      .then((rolePerm) => {})
      .catch((error) => {
        res.status(403).send(error);
      });
    Role.findByPk(req.params.id, {
      include: {
        model: Permission,
        as: 'permission',
      },
    })
      .then((roles) => res.status(200).send(roles))
      .catch((error) => {
        res.status(400).send(error);
      });
  }
);

// update a Role
router.put(
  '/:id',
  passport.authenticate('jwt', {
    session: false,
  }),
  function (req, res) {
    helper
      .checkPermission(req.user.role_id, 'role_update')
      .then((rolePerm) => {
        if (
          !req.params.id ||
          !req.body.role_name ||
          !req.body.role_description
        ) {
          res.status(400).send({
            msg: 'Missing Role ID, name or description!',
          });
        } else {
          Role.findByPk(req.params.id)
            .then((role) => {
              Role.update(
                {
                  role_name: req.body.role_name || role.role_name,
                  role_description:
                    req.body.role_description || role.role_description,
                },
                {
                  where: {
                    id: req.params.id,
                  },
                }
              )
                .then(() => {
                  res.status(200).send({ msg: 'Role updated!' });
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

// delete a Role
router.delete(
  '/:id',
  passport.authenticate('jwt', {
    session: false,
  }),
  function (req, res) {
    helper
      .checkPermission(req.user.role_id, 'role_delete')
      .then((rolePerm) => {
        if (!req.params.id) {
          res.status(400).send({ msg: 'Missing role ID' });
        } else {
          Role.findByPk(req.params.id)
            .then((role) => {
              if (role) {
                Role.destroy({
                  where: {
                    id: req.params.id,
                  },
                })
                  .then(() => {
                    res.status(200).send({ msg: 'Role deleted!' });
                  })
                  .catch((err) => res.sendStatus(400).send(err));
              } else {
                res.status(404).send({ msg: 'Role not found!' });
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

// Add Permissions to Role
router.post(
  '/permissions/:id',
  passport.authenticate('jwt', {
    session: false,
  }),
  function (req, res) {
    helper
      .checkPermission(req, user.role_id, 'role_add')
      .then((rolePerm) => {
        if (!req.body.permissions) {
          res.status(400).send({ msg: 'Missing permissions!' });
        } else {
          Role.findByPk(req.params.id)
            .then((role) => {
              req.body.permissions.forEach((item, index) => {
                Permission.findByPk(item)
                  .then(async (perm) => {
                    await role.addPermissions(perm, {
                      through: {
                        selfGranted: false,
                      },
                    });
                  })
                  .catch((error) => {
                    res.status(400).send(error);
                  });
              });
              res.status(200).send({
                msg: 'Permissions added!',
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

module.exports = router;
