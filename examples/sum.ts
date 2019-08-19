import * as pull from "../lib/types.ts";
import { values } from "../lib/values.ts";

function sum(done: (x: number) => void): pull.Sink<number> {
  let total = 0;

  return function sink(read: pull.Source<number>) {
    function cont(end, value) {
      if (end) {
        return done(total);
      }

      total += value!;
      console.error(new Error());
      read(null, cont);
    }

    read(null, cont);
  };
}

sum(x => console.log(x))(values([1, 2, 3]));
