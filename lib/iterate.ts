import { Cont, End, Source, Through } from "./types.ts";

export function iterate<V>(read: Source<V>) {
  return {
    [Symbol.asyncIterator]() {
      return {
        next(): Promise<IteratorResult<V>> {
          return new Promise((resolve, reject) => {
            read(null, function(end, value) {
              resolve({value, done: end ? true : false});
            });
          });
        },

        return(): Promise<IteratorResult<V>> {
          return new Promise((resolve, reject) => {
            read(true, null);
            resolve({value: undefined, done: true});
          });
        },
      };
    },
  };
}
