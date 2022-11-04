const User = require('../models/user');
const Role = require('../models/role');
const router = require('./users');

// user signup
router.post('/signup', (req, res) => {
  if (!req.body.email || !req.body.password || !req.body.fullname) {
    res.status(400).send({ msg: 'Missing email, password or fullname' });
  } else {
    Role.findOne({
      where: {
        role_name: 'admin',
      },
    })
      .then((role) => {
        User.create({
          email: req.body.email,
          password: req.body.password,
          fullname: req.body.fullname,
          role_id: role_id,
        })
          .then((user) => res.status(201).send(user))
          .catch((error) => {
            res.status(400).send(error);
          });
      })
      .catch((error) => {
        res.status(400).send(error);
      });
  }
});

// user signin
router.post('/signin', (req, res) => {
  User.findOne({
    where: {
      email: req.body.email,
    },
  })
    .then((user) => {
      if (!user) {
        return res.status(401).send({ msg: 'User not found!' });
      }
      user.comparePassword(req.body.password, (err, isMatch) => {
        if (isMatch && !err) {
          var token = jwt.sign(
            JSON.parse(JSON.stringify(user)),
            'nodeauthsecret',
            {
              expiresIn: 86400 * 30,
            }
          );
          jwt.verify(token, 'nodeauthsecret', function (err, data) {
            console.log(err, data);
          });
          res.json({
            success: true,
            token: 'JWT ' + token,
          });
        } else {
          res.status(401).send({
            success: false,
            msg: 'Authentication failed. Wrong password!',
          });
        }
      });
    })
    .catch((error) => res.status(400).send(error));
});

module.exports = router;
