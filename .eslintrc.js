module.exports = {
  "env": {
    "browser": true,
    "es2021": true,
  },
  "extends": "airbnb-base",
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true,
    },
    "ecmaVersion": "latest",
    "sourceType": "module",
  },
  "plugins": [
    "react",
  ],
  "rules": {
    "quotes": "off",
    "quote-props": "off",
    "no-underscore-dangle": ["error", {
      "allow": ["_id"],
    }],
  },
};
