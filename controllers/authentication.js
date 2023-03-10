const jwt = require('jwt-simple');
const User = require('../models/user');

const tokenSecret = process.env.NODE_ENV === 'production' ? process.env.PROD_TOKEN_SECRET : 'helloworld';

function tokenForUser(user) {
  return jwt.encode({
    sub: user.id,
    iat: Math.round(Date.now() / 1000),
  }, tokenSecret);
}

module.exports.signin = (req, res, next) => {
  const user = {
    email: req.user.email,
    username: req.user.username,
    token: tokenForUser(req.user),
  }

  res.send(user);
}

module.exports.signup = (req, res, next) => {
  const { username, password, email } = req.body;

  if (!(email || password || username)) {
    return res.status(422).send({ error: "You must provide email, username, and password" });
  }

  User.findOne({ email }, (err, existingUser) => {
    if (err) {
      return next(err);
    }
    if (existingUser) {
      return res.status(422).send({ error: "Email in use" })
    }

    const user = new User();
    user.username = username;
    user.email = email;

    user.setPassword(password, user);

    user.save((err, user) => {
      if (err) {
        return next(err);
      }

      res.json({
        token: tokenForUser(user),
        email,
        username,
      })
    })

  })
}

module.exports.currentUser = (req, res) => {
  const { email, username } = req.user;

  res.json({
    email,
    username,
    token: tokenForUser(req.user)
  });
}