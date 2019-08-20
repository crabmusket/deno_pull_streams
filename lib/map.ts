import { Cont, End, Source, Through } from "./types.ts";

export function map<V, W>(fn: (v: V) => W): Through<V, W> {
  return function mapThrough(read: Source<V>): Source<W> {
    return function mapSource(end: End, cont: Cont<W>) {
      read(end, function(end, value) {
        if (end) {
          cont(end, undefined);
        } else {
          cont(null, fn(value));
        }
      });
    };
  };
}
