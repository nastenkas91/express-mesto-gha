const URL_REGEX = /^(https?:\/\/(www\.)?([a-zA-z0-9-]{1}[a-zA-z0-9-]*\.?)*\.{1}([a-zA-z0-9]){2,8}(\/?([a-zA-z0-9-])*\/?)*\/?([-._~:?#[]@!\$&'\(\)\*\+,;=])*)/;

const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

module.exports = {
  URL_REGEX, DEFAULT_ALLOWED_METHODS,
};
