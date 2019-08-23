import { test, assertEquals, runIfMain } from "./_test_utils.ts";
import { delay } from "https://deno.land/std@826deb1/util/async.ts";
import { values } from "./values.ts";
import { iterate } from "./iterate.ts";
import { window } from "./window.ts";

test(async function basicWindow() {
  let numbers = values([1, 2, 3, 4, 5, 6]);
  let windower = window(3);
  let stream = iterate(windower(numbers));
  let iterator = stream[Symbol.asyncIterator]();
  assertEquals([1, 2, 3], (await iterator.next()).value);
  assertEquals([2, 3, 4], (await iterator.next()).value);
  assertEquals([3, 4, 5], (await iterator.next()).value);
  assertEquals([4, 5, 6], (await iterator.next()).value);
  assertEquals({ done: true, value: undefined }, await iterator.next());
});

test(async function emptyWindow() {
  let numbers = values([]);
  let windower = window(3);
  let stream = iterate(windower(numbers));
  let iterator = stream[Symbol.asyncIterator]();
  assertEquals({ done: true, value: undefined }, await iterator.next());
});

runIfMain(import.meta.main);
