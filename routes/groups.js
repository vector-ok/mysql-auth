var express = require('express');
const Group = require('../models/group');
var router = express.Router();
const passport = require('passport');
const Helper = require('../utils/helper');
require('../config/passport')(passport);

const helper = Helper();

// create new Group
router.post(
  '/',
  passport.authenticate('jwt', {
    session: false,
  }),
  function (req, res) {
    helper
      .checkPermission(req.user.role_id, 'group_add')
      .then((rolePerm) => {
        if (!req.body.group_name || !req.body.group_description) {
          res.status(400).send({
            msg: 'Missing Group Name or Description!',
          });
        } else {
          Group.create({
            group_name: req.body.group_name,
            group_description: req.body.group_description,
          })
            .then((group) => {
              res.status(201).send(group);
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

// get list of groups
router.get(
  '/',
  passport.authenticate('jwt', {
    session: false,
  }),
  function (req, res) {
    helper
      .checkPermission(req.user.role_id, 'groups_get_all')
      .then((rolePerm) => {
        Group.findAll()
          .then((groups) => res.status(200).send(groups))
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(403).send(error));
  }
);

// get Permission by id
router.get(
  '/:id',
  passport.authenticate('jwt', {
    session: false,
  }),
  function (req, res) {
    helper
      .checkPermission(req.user.role_id, 'permission_get')
      .then((rolePerm) => {
        Group.findByPk(req.params.id)
          .then((group) => res.status(200).send(group))
          .catch((error) => {
            res.status(400).send(error);
          });
      })
      .catch((error) => {
        res.status(403).send(error);
      });
  }
);

// update a Group
router.put(
  '/:id',
  passport.authenticate('jwt', {
    session: false,
  }),
  function (req, res) {
    helper
      .checkPermission(req.user.role_id, 'group_update')
      .then((rolePerm) => {
        if (!req.body.group_name || !req.body.group_description) {
          res.status(400).send({
            msg: 'Missing Group name or description!',
          });
        } else {
          Group.findByPk(req.params.id)
            .then((group) => {
              Group.update(
                {
                  group_name: req.body.group_name || group.group_name,
                  group_description:
                    req.body.group_description || group.group_description,
                },
                {
                  where: {
                    id: req.params.id,
                  },
                }
              )
                .then(() => {
                  res.status(200).send({ msg: 'Group updated!' });
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

// delete a Group
router.delete(
  '/:id',
  passport.authenticate('jwt', {
    session: false,
  }),
  function (req, res) {
    helper
      .checkPermission(req.user.role_id, 'group_delete')
      .then((rolePerm) => {
        if (!req.params.id) {
          res.status(400).send({ msg: 'Missing Group ID' });
        } else {
          Group.findByPk(req.params.id)
            .then((group) => {
              if (group) {
                Group.destroy({
                  where: {
                    id: req.params.id,
                  },
                })
                  .then(() => {
                    res.status(200).send({ msg: 'Group deleted!' });
                  })
                  .catch((err) => res.sendStatus(400).send(err));
              } else {
                res.status(404).send({ msg: 'Group not found!' });
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
