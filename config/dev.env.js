'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_HOST: '"http://172.20.114.85:8082/tvmanage"',
  API_BASE_URL: '"http://172.20.114.85:8082/"'
})
