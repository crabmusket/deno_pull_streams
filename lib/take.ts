import { Cont, End, Source, Through } from "./types.ts";

export function take<V>(n: number): Through<V, V> {
  if (isNaN(n)) {
    throw new Error("cannot take NaN elements");
  }
  if (n < 0) {
    throw new Error("cannot take a negative number of elements");
  }
  if (!isFinite(n)) {
    throw new Error("cannot take infinitely many elements, that is pointless");
  }

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
