# deno_pull_streams

![badge: version is 0.1 (unstable)](https://img.shields.io/badge/version-0.1%20%28unstable%29-red)

A port of [pull-stream](https://github.com/pull-stream/pull-stream) to TypeScript for use with [Deno](https://deno.land).

A basic example:

```typescript
import { map } from "https://raw.githubusercontent.com/crabmusket/deno_pull_streams/v0.1/lib/map.ts"
import { values } from "https://raw.githubusercontent.com/crabmusket/deno_pull_streams/v0.1/lib/values.ts"
import { each } from "https://raw.githubusercontent.com/crabmusket/deno_pull_streams/v0.1/lib/each.ts"

let log = each(x => console.log(x))
let increment = map(x => x + 1);
let stream = values([1, 2, 3]);
log(increment(stream));
```

Infinite streams!

```typescript
import { Source } from "https://raw.githubusercontent.com/crabmusket/deno_pull_streams/v0.1/lib/types.ts"
import { take } from "https://raw.githubusercontent.com/crabmusket/deno_pull_streams/v0.1/lib/take.ts"
import { each } from "https://raw.githubusercontent.com/crabmusket/deno_pull_streams/v0.1/lib/each.ts"

let randoms: Source<number> = function(end, cont) {
  if (end) {
    cont(end, undefined);
  } else {
    cont(null, Math.random());
  }
};

let log = each(x => console.log(x))
let first5 = take(5);
log(first5(randoms));
```

See [examples](./examples) for more.
