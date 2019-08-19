import { Sink } from "../lib/types.ts";
import { values } from "../lib/values.ts";
import { reduce } from "../lib/reduce.ts";

async function main() {
  const sum: Sink<number, Promise<number>> = reduce((total, x) => total + x, 0);
  let total = await sum(values([1, 2, 3]));
  console.log(total);
}

main();
