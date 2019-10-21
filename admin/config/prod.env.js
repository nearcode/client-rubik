'use strict'
const axios = require('axios')

let HOST = JSON.parse(process.env.npm_config_argv).original[3] || 'test';
// let HOST =process.argv.splice(2)[0] || 'prod';
//
console.log(HOST)

module.exports = {
    NODE_ENV: '"production"',
    HOST: '"' + HOST + '"'
}
