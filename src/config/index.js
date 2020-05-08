const deepmerge = require('deepmerge');

const defaultConfig = require('./default-config');
let userConfig;
let config;

try {
  userConfig = require('../../config');
} catch (e) {
  userConfig = {};
}

config = deepmerge(defaultConfig, userConfig);

if (typeof global._shared === 'undefined') {
  global._shared = {};
}

global._shared.config = config;

module.exports = config;
