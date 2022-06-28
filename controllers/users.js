const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require('dotenv').config();
const User = require("../models/user");
const NotFound = require("../errors/NotFound");
const AuthorisationError = require("../errors/AuthorisationError");
const Conflict = require("../errors/Conflict");
const ValidationError = require("../errors/ValidationError");

// const { NODE_ENV, JWT_SECRET } = process.env;

// Поиск всех пользователей
module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      if (!users) {
        return next(new NotFound('Пользователи не найдены'));
      }
      return res.send({ users });
    })
    .catch(next);
};

// Поиск пользователя по id
module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (!user) {
        return next(new NotFound(`Пользователь по указанному id не найден`));
      } return res.send({ data: user });
    })
    .catch(next);
};

// Добавить нового пользователя
module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new Conflict('Пользователь с данным email уже существует');
      }
      return bcrypt.hash(password, 10);
    })
    .then((hash) => User.create(
      {
        name, about, avatar, email, password: hash,
      },
    ))
    .then((user) => res.send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
      _id: user._id,
    }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const errMessage = err.message.replace('user validation failed:', '');
        next(new ValidationError(`Переданы некорректные данные в полях:${errMessage}`));
      }
      next(err);
    });
};

// Обновить данные пользователя
module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        return next(new NotFound(`Пользователь по указанному id не найден`));
      }
      return res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const errMessage = err.message.replace('user validation failed:', '');
        next(new ValidationError(`Переданы некорректные данные в полях:${errMessage}`));
      }
      next(err);
    });
};

// Обновить аватар
module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .then((user) => {
      if (!user) {
        return next(new NotFound(`Пользователь по указанному id не найден`));
      }
      return res.send({ user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('введен некорректный URL'));
      }
      next(err);
    });
};

// авторизация
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        throw new AuthorisationError('Неправильные почта или пароль');
      } return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new AuthorisationError('Неправильные почта или пароль');
          } const token = jwt.sign({ _id: user._id }, 'secret-key', { expiresIn: '7d' });// res.cookie('jwt', token, { maxAge: 3600000 * 7, httpOnly: true, sameSite: true }).send({
          res.send({
            name: user.name,
            about: user.about,
            avatar: user.avatar,
            email: user.email,
            _id: user._id,
            token,
          });
        });
    })
    .catch(next);
};

// получить текущего пользователя
module.exports.getMe = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        return next(new NotFound(`Пользователь по указанному id не найден`));
      }
      return res.send({
        name: user.name,
        about: user.about,
        avatar: user.avatar,
        email: user.email,
        _id: user._id,
      });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Переданы некорректные данные.'));
      } else {
        next(err);
      }
    });
};

// catch((err) => {
//   if (err.name === 'CastError') {
//     next(new NotFound(`Пользователь не найден`));
//   } next(err);
// });
// message: `Переданы некорректные данные в полях: ${Object.keys(err.errors)}`
