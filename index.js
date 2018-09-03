// Transpile all code following this line with babel and use 'env' (aka ES6) preset.
require('babel-register')({
    presets: [ 'env' ]
})

//https://github.com/babel/babel-preset-env/issues/340
require("@babel/polyfill");

// Import the rest of our application.
module.exports = require('./app.js')