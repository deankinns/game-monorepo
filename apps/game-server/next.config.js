const withTM = require("next-transpile-modules")([
    "ui",
    "tsconfig",
    "becsy-yuka-package",
    "becsy-package",
    "becsy-ui",
    "yuka-package",
    "@lastolivegames/becsy"
]);

module.exports = withTM({
    reactStrictMode: true,
});
