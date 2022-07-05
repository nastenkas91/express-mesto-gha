const ALLOWED_ORIGIN = [
  'http://mesto-project.nomoredomains.sbs',
  'https://mesto-project.nomoredomains.sbs'];

const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

const cors = (req, res, next) => {
  const { Referer } = req.headers;
  const { method } = req;
  const requestHeaders = req.headers['access-control-request-headers'];

  if (ALLOWED_ORIGIN.includes(Referer)) {
    res.header('Access-Control-Allow-Origin', Referer);
  }

  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.end();
  }
  return next();
};

module.exports = cors;
