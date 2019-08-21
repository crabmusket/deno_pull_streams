import { End, Source, Sink } from "./types.ts";

export function each<V>(callback: (v: V) => unknown): Sink<V> {
  return function eachSink(read: Source<V>) {
    function cont(end: End, value: V | undefined) {
      if (end) {
        return;
      }

      let result = callback(value!);
      if (result instanceof Promise) {
        result.then(() => read(null, cont));
      } else {
        Promise.resolve().then(() => read(null, cont));
      }
    }

    read(null, cont);
  };
}
