const router = require('express').Router();
const { celebrate, Joi } = require("celebrate");
const {
  getUsers, getUserById, updateUser, updateAvatar, getMe,
} = require('../controllers/users');

router.get('/', getUsers);

router.get('/:userId', celebrate({
  body: Joi.object().keys({
    userId: Joi.string().hex().length(24),
  }),
}), getUserById);

router.get('/me', getMe);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUser);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(/^(https?:\/\/(www\.)?([a-zA-z0-9-]{1}[a-zA-z0-9-]*\.?)*\.{1}([a-zA-z0-9]){2,8}(\/?([a-zA-z0-9-])*\/?)*\/?([-._~:?#[]@!\$&'\(\)\*\+,;=])*)/),
  }),
}), updateAvatar);

module.exports = router;
