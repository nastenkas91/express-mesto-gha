const Card = require("../models/card");
const NotFound = require("../errors/NotFound");
const Forbidden = require("../errors/Forbidden");
const ValidationError = require("../errors/ValidationError");

// Поиск всех карточек
module.exports.getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => {
      if (!cards) {
        return next(new NotFound('Пользователи не найдены'));
      }
      return res.send({ data: cards });
    });
};

// Создать новую карточку
module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create(
    { name, link, owner: req.user._id },
  )
    .then((card) => res.send({ card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const errMessage = err.message.replace('user validation failed:', '');
        next(new ValidationError(`Переданы некорректные данные в полях:${errMessage}`));
      }
      next(err);
    });
};

// Удалить карточку
module.exports.deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  Card.findById({ cardId })
    .then((card) => {
      if (!card) {
        throw new NotFound(`Карточка по указанному id не найдена`);
      } else if (String(card.owner) !== req.user._id) {
        throw new Forbidden('Доступ ограничен');
      } return Card.findByIdAndRemove(
        cardId,
        { new: true, runValidators: true },
      )
        .then((deletedCard) => res.send({ data: deletedCard }));
    })
    .catch(next);
};

// Поставить лайк
module.exports.addLike = (req, res, next) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return next(new NotFound(`Карточка по указанному id не найдена`));
      }
      return res.send({ card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new NotFound(`Карточка по указанному id не найдена`));
      } next(err);
    });
};

// Удалить лайк
module.exports.removeLike = (req, res, next) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        return next(new NotFound(`Карточка по указанному id не найдена`));
      }
      return res.send({ card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new NotFound(`Карточка по указанному id не найдена`));
      } next(err);
    });
};
