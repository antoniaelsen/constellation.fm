module.exports = {
  extends: [
    "react-app",
    "airbnb-base",
    "plugin:prettier/recommended",
    "prettier/@typescript-eslint",
  ],
  rules: {
    "import/extensions": [1, "never"],
    "consistent-return": "off",
    "no-underscore-dangle": "off",
    "no-alert": "off",
    "no-param-reassign": "off",
    "no-console": "off",
    "no-shadow": "off",
    "no-unused-expressions": "off",
    "import/no-cycle": "off",
    "import/prefer-default-export": "off",
  },
  settings: {
    "import/resolver": {
      node: {
        paths: ["src"],
        extensions: [".js", ".jsx", ".ts", ".tsx"],
      },
    },
  },
};
