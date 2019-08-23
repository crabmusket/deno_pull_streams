import { Source } from "./types.ts";
import { reduce } from "./reduce.ts";

export function collect<V, R>(read: Source<V>): Promise<V[]> {
  let collector = reduce((items, item) => (items.push(item), items), []);
  return collector(read);
}
