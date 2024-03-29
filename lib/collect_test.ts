import { test, assertEquals, runIfMain } from "./_test_utils.ts";
import { values } from "./values.ts";
import { collect } from "./collect.ts";

test(async function collectValues() {
  let result = await collect(values([1, 2, 3]));
  assertEquals([1, 2, 3], result);
});

test(async function collectAsyncValues() {
  function asyncValues<T>(array: T[]) {
    let index = 0;
    return function valuesSource(end, cont) {
      if (end) {
        return;
      }

      if (index >= array.length) {
        return cont(true, undefined);
      }

      index += 1;
      setTimeout(() => {
        cont(null, array[index - 1]);
      }, 100);
    };
  }

  let result = await collect(asyncValues([1, 2, 3]));
  assertEquals([1, 2, 3], result);
});

runIfMain(import.meta.main);
