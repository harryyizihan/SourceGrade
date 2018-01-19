const jwt = require('jwt-simple');
const User = require('../models/user');
const router = require('express').Router();
const passport = require('passport');
require('../config/passport')(passport); // passport configs

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config(); // eslint-disable-line
}

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, process.env.SECRET);
}

const requireLogin = passport.authenticate('local', { session: false });

router.post('/login', requireLogin, (req, res) => {
  return res.json({ token: tokenForUser(req.user) });
});

router.post('/signup', (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(422).send({ error: 'You must provide a username and password' });
  }

  return User.findOne({ username }, (err, existingUser) => {
    if (err) { return next(err); }

    if (existingUser) {
      return res.status(422).send({ error: 'Username is already taken' });
    }

    const user = new User({
      username,
      password,
    });

    return user.save((error) => {
      if (error) { return next(error); }

      return res.json({ token: tokenForUser(user) });
    });
  });
});

module.exports = router;
