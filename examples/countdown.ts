import { values } from "../lib/values.ts";
import { iterate } from "../lib/iterate.ts";
import { delay } from "https://deno.land/std@826deb1/util/async.ts";

async function main() {
  for await (let x of iterate(values([3, 2, 1]))) {
    console.log(x + '...');
    await delay(1000);
  }

  console.log("party time!!");
}

main();
