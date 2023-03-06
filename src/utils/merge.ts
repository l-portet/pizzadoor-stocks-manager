import tsmerge from 'ts-deepmerge';

export default (a?: object, b?: object) => {
  if (!a) {
    return b;
  }
  if (!b) {
    return a;
  }
  return tsmerge.withOptions({ mergeArrays: false }, a, b);
};
