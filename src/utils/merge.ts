import tsmerge from 'ts-deepmerge';

export default (a: object, b: object) =>
  tsmerge.withOptions({ mergeArrays: false }, a, b);
