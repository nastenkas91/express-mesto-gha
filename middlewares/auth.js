require('dotenv').config();
const jwt = require('jsonwebtoken');
const AuthorisationError = require("../errors/AuthorisationError");

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  if (!token) {
    return next(new AuthorisationError('Необходима авторизация'));
  } let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'secret-key');
  } catch (err) {
    return next(new AuthorisationError('Необходима авторизация'));
  } req.user = payload;
  return next();
};
