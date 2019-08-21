import { Sink, Through } from "../lib/types.ts";
import { map } from "../lib/map.ts";
import { values } from "../lib/values.ts";
import { each } from "../lib/each.ts";
import { pad } from "https://deno.land/std@v0.12/strings/pad.ts";

const log: Sink<any> = each(x => console.log(x));
const double: Through<number, number> = map(x => x * 2);
const hexify: Through<number, string> = map(x => "0x" + x.toString(16));
const tableRows: Through<string, string> = map(
  x => "|" + pad(x, 8, { side: "left" }) + "|"
);

log(tableRows(hexify(double(values([100, 200, 300])))));
