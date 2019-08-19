import { Cont, End, Source, Sink } from "./types.ts";

export function each<V>(callback: (v: V) => void): Sink<V> {
  return function eachSink(read: Source<any>) {
    function cont(end, value) {
      if (end) {
        return;
      }

      callback(value);
      Promise.resolve().then(() => read(null, cont));
    }

    read(null, cont);
  };
}
