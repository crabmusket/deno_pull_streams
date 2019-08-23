import { test, assertEquals, runIfMain } from "./_test_utils.ts";
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

runIfMain(import.meta.main);
