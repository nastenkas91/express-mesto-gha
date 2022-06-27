const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    default: 'Жак-Ив Кусто',
    minlength: [2, 'имя должно быть длиной минимум 2 символа'],
    maxlength: [30, 'имя должно быть длиной максимум 30 символов'],
  },
  about: {
    type: String,
    default: 'Исследователь',
    minlength: [2, 'род деятельности должен быть длиной минимум 2 символа'],
    maxlength: [30, 'род деятельности должен быть длиной максимум 30 символов'],
  },
  avatar: {
    type: String,
    validate: {
      validator: (v) => validator.isURL(v),
      message: 'введите корректный URL',
    },
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'требуется ввести email'],
    validate: {
      validator: (mail) => validator.isEmail(mail),
      message: 'введите корректный email',
    },
  },
  password: {
    type: String,
    required: [true, 'требуется ввести пароль'],
    select: false,
  },
});

module.exports = mongoose.model('user', userSchema);
