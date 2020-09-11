module.exports = {
    env: {
        browser: true,
        commonjs: true,
        es6: true,
        node: true,
        jest: true,
    },
    parserOptions: {
        ecmaVersion: 2020,
        ecmaFeatures: {
            impliedStrict: true,
            jsx: true,
        },
        sourceType: "module",
    },
    extends: [
        "google",
        "eslint:recommended",
    ],
    settings: {
        react: {
            version: "detect",
        },
    },
    rules: {
        "space-before-function-paren": ["off"],
        "object-curly-spacing": [2, "always"],
        "indent": [
            "error",
            4,
            {
                SwitchCase: 1,
                ObjectExpression: "off",
            },
        ],
        "linebreak-style": 0,
        "quotes": ["error", "double"],
        "semi": ["error", "always"],
        "require-jsdoc": 0,
        // "no-console": [
        //     "warn",
        //     { "allow": ["log", "clear", "info", "error", "dir", "trace"] }
        // ],
    },
};
