module.exports = {
  env: {
    browser: true,
    node: true,
    es2020: true,
  },
  extends: ["airbnb-base", "prettier"],
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 11,
  },
  rules: {
    "no-console": "off",
    "no-underscore-dangle": "off",
    "no-nested-ternary": "off",
    "import/prefer-default-export": "off",
    "import/no-extraneous-dependencies": "off",
  },
};
