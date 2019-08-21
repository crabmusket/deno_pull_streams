import { test, runTests } from "https://deno.land/std@v0.11.0/testing/mod.ts";
import { assertEquals } from "https://deno.land/std@v0.11.0/testing/asserts.ts";
import { values } from "./values.ts";

test(async function emptyValues() {
  let read = values([]);

  await new Promise((resolve, reject) => {
    read(null, function(end, data) {
      assertEquals(true, end);
      assertEquals(undefined, data);
      resolve();
    });
  });
});

test(async function twoValues() {
  let read = values([1, 2]);

  await new Promise((resolve, reject) => {
    read(null, function(end, data) {
      assertEquals(null, end);
      assertEquals(1, data);

      read(null, function(end, data) {
        assertEquals(null, end);
        assertEquals(2, data);

        read(null, function(end, data) {
          assertEquals(true, end);
          assertEquals(undefined, data);
          resolve();
        });
      });
    });
  });
});

if (import.meta.main) {
  runTests();
}
