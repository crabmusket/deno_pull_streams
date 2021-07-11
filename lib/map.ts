import { Cont, End, Source, Through } from './types.ts';

type MapCallback<V, W> = ((v: V) => Promise<W>) | ((v: V) => W);

export function map<V, W>(fn: MapCallback<V, W>): Through<V, W> {
  return function mapThrough(read: Source<V>): Source<W> {
    return function mapSource(end: End, cont: Cont<W>) {
      read(end, function(end, value) {
        if (end) {
          cont(end, undefined);
        } else {
          let result = fn(value!);
          if (result instanceof Promise) {
            result.then(r => cont(null, r));
          } else {
            cont(null, result);
          }
        }
      });
    };
  };
}
