import { Cont, End, Source, Through } from "./types.ts";

export function take<V>(n: number): Through<V, V> {
  let remaining = n;
  return function takeThrough(read: Source<V>): Source<V> {
    return function takeSource(end: End, cont: Cont<V>) {
      read(end, function(end, value) {
        if (end) {
          cont(end, undefined);
        } else {
          cont(remaining-- <= 0 ? true : null, value);
        }
      });
    };
  };
}
