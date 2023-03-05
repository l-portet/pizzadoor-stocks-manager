import fs from 'fs';
import { join } from 'path';

import merge from 'ts-deepmerge';

import type { Config } from '../types';
import defaultConfig from './default.stub';

let userConfig: Partial<Config>;

try {
  const file = fs.readFileSync(join(__dirname, '../../config.json')).toString();
  userConfig = JSON.parse(file);
} catch (e) {
  userConfig = {};
}

export default merge.withOptions({ mergeArrays: false }, defaultConfig, userConfig) as unknown as Config;
