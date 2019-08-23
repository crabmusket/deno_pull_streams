import { Cont, End, Source, Through } from "./types.ts";

export function window<V>(n: number): Through<V, V[]> {
  if (isNaN(n)) {
    throw new Error("cannot window NaN elements");
  }
  if (n < 1) {
    throw new Error("must window a positive number of elements");
  }
  if (!isFinite(n)) {
    throw new Error("cannot window infinitely many elements");
  }

  const windowSize = Math.floor(n);
  let elements: V[] = [];

  return function windowThrough(read: Source<V>): Source<V[]> {
    return function windowSource(end: End, cont: Cont<V[]>) {
      read(end, function windowCont(end, value) {
        if (end) {
          cont(end, undefined);
        } else {
          elements.push(value!);
          if (elements.length < windowSize) {
            read(null, windowCont);
          } else {
            let thisWindow = elements;
            elements = elements.slice(1);
            cont(null, thisWindow);
          }
        }
      });
    };
  };
}
