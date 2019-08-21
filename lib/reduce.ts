import { End, Source, Sink } from "./types.ts";

export function reduce<V, R>(
  reducer: (accum: R, current: V) => R,
  initial: R
): Sink<V, Promise<R>> {
  return function reduceSink(read: Source<V>): Promise<R> {
    let accumulator = initial;
    return new Promise((resolve, reject) => {
      function cont(end: End, value: V | undefined) {
        if (end) {
          return resolve(accumulator);
        }

        accumulator = reducer(accumulator, value!);
        Promise.resolve().then(() => read(null, cont));
      }

      read(null, cont);
    });
  };
}
