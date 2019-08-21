import { Source } from "./types.ts";

export function iterate<V>(read: Source<V>) {
  return {
    [Symbol.asyncIterator]() {
      return {
        next(): Promise<IteratorResult<V>> {
          return new Promise((resolve, reject) => {
            read(null, function(end, value) {
              resolve({ value: value!, done: end ? true : false });
            });
          });
        },

        return(): Promise<IteratorResult<V>> {
          return new Promise((resolve, reject) => {
            read(true, (end, value) => {});
            resolve({ value: undefined!, done: true });
          });
        }
      };
    }
  };
}
