module.exports = {
  env: {
    es6: true,
    node: true
  },
  extends: "airbnb-base",
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly"
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module"
  },
  rules: {
    semi: 2,
    "max-len": ["error", 130],
    "no-unused-vars": 2,
    "no-multiple-empty-lines": ["error", { max: 2 }],

    // Due to NODE_PATH and absolute requires this rule must be disabled until we  switch to proper requires
    "import/no-unresolved": "on",
    // Used in dimensions, must be double checked
    "no-underscore-dangle": "off",
    // Project must be fixed before enabling following rules
    // | easy to fix
    "no-unused-expressions": 1,
    "no-empty": "off",
    "prefer-destructuring": "off",
    "prefer-spread": "off",
    "no-use-before-define": "off",
    // | potentially dangerous
    "global-require": "off",
    "no-param-reassign": "off",
    "import/no-dynamic-require": "off",
    "default-case": "off",
    "no-loop-func": "off",
    // | dangerous
    "no-restricted-syntax": "off",
    "consistent-return": "off",
    "no-shadow": "off",
    // | warnings - check when everything else has been fixed
    "no-console": "off",
    "no-constant-condition": "off",
    "func-names": "off"
  }
};
