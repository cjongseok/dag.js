module.exports = {
  "extends": "airbnb",
  "plugins": [
    "react",
    "chai-expect",
  ],
  "rules": {
    "react/jsx-no-bind": "off",
    "jsx-a11y/href-no-hash": "off"
  },
  "env" : {
    "node": true,
    "mocha": true,
  }
};
