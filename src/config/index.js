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

module.exports = config;
