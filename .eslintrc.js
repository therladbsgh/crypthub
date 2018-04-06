module.exports = {
    "extends": "airbnb-base",
    "env": {
      "browser": true,
      "node": true,
      "jquery": true
    },
    "rules": {
      "no-plusplus": ["error", { "allowForLoopAfterthoughts": true }],
      "no-alert": 0,
      "no-console": 0,
    }
};
