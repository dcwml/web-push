module.exports = {
    env: {
        es6: true,
        node: true,
        mocha: true
    },
    root: true,
    // parser: 'babel-eslint',\
    // plugins: [
    //     'html'
    // ],
    "extends": "standard",
    'rules': {
        // allow paren-less arrow functions
        'arrow-parens': 0,
        // allow async-await
        'generator-star-spacing': 0,
        // allow debugger during development
        'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
        'no-unused-vars': ["error", { "vars": "all"}],
        'operator-linebreak': 0,
        'no-undef': 2
    }
};