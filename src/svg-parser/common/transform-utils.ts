export const flattenAndClean = (value: any[] | any): typeof value =>
  value instanceof Array
    ? value.reduce(
        (acc, subValue) => (subValue instanceof Array ? [...acc, ...flattenAndClean(subValue)] : subValue === '' ? acc : [...acc, subValue]),
        []
      )
    : value;
