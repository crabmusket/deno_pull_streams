import { runTests } from "https://deno.land/std@ed1b9e0/testing/mod.ts";

export { test } from "https://deno.land/std@ed1b9e0/testing/mod.ts";
export * from "https://deno.land/std@ed1b9e0/testing/asserts.ts";

export async function runIfMain(main) {
  if (main) {
    await runTests();
  }
}
