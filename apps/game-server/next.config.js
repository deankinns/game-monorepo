const withTM = require("next-transpile-modules")(["ui", "tsconfig", "becsy-yuka-package"]);

module.exports = withTM({
  reactStrictMode: true,
});
