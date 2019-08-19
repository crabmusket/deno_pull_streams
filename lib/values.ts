import { Source } from "./types.ts";

/**
 * A source that produces the values from 'array' then ends.
 */
export function values<T>(array: T[]): Source<T> {
  let index = 0;
  return function valuesSource(end, cont) {
    if (end) {
      return;
    }

    if (index >= array.length) {
      return cont(true, undefined);
    }

    index += 1;
    cont(null, array[index - 1]);
  };
}
