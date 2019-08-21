import { Source } from "../lib/types.ts";
import { iterate } from "../lib/iterate.ts";
import { take } from "../lib/take.ts";

let randoms: Source<number> = function(end, cont) {
  if (end) {
    cont(end, undefined);
  } else {
    cont(null, Math.random());
  }
};

async function main() {
  for await (let x of iterate(take(5)(randoms))) {
    console.log(x);
  }
}

main();
