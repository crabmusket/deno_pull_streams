# deno_pull_streams

![badge: version is 0.1 (unstable)](https://img.shields.io/badge/version-0.1%20%28unstable%29-red)

A port of [pull-stream](https://github.com/pull-stream/pull-stream) to TypeScript for use with [Deno](https://deno.land).

<!-- MDTOC maxdepth:6 firsth1:0 numbering:0 flatten:0 bullets:1 updateOnSave:1 -->

- [Two quick examples](#two-quick-examples)   
- [What are pull streams?](#what-are-pull-streams)   
- [Why use pull streams?](#why-use-pull-streams)   
- [Why did you port this library?](#why-did-you-port-this-library)   
- [Handbook of modules in this library](#handbook-of-modules-in-this-library)   
   - [Core API](#core-api)   
   - [Sources](#sources)   
   - [Throughs](#throughs)   
   - [Sinks](#sinks)   
- [`pull` is missing!](#pull-is-missing)   
- [Roadmap](#roadmap)   

<!-- /MDTOC -->

## Two quick examples

A basic example:

```typescript
import { map } from "https://raw.githubusercontent.com/crabmusket/deno_pull_streams/v0.1/lib/map.ts"
import { values } from "https://raw.githubusercontent.com/crabmusket/deno_pull_streams/v0.1/lib/values.ts"
import { each } from "https://raw.githubusercontent.com/crabmusket/deno_pull_streams/v0.1/lib/each.ts"

let numbers = values([1, 2, 3]);
let increment = map(x => x + 1);
let log = each(x => console.log(x))
log(increment(numbers));
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

let first5 = take(5);
let log = each(x => console.log(x))
log(first5(randoms));
```

See [examples](./examples) for more.

## What are pull streams?

See [lib/types.ts](./lib/types.ts) for a readable introduction to the core abstractions of pull streams.

## Why use pull streams?

From [Dominic Tarr](https://dominictarr.com/post/149248845122/pull-streams-pull-streams-are-a-very-simple), creator of pull-stream:

> node.js streams have the concept of a “writable” stream. A writable is a passive object that accepts data, like a couch-potato watching the TV. They must actively use the TV remote to send an explicit signal to the TV when they want to stop or slow down. A pull-stream sink is a reader. it is like a book-worm reading a book - they are active and can read faster or slower. They don’t need to send an explicit signal to slow down, they just act slower.

I got into pull streams when I needed to stream large JSON files from disk into a database, but existing libraries couldn't usefully handle back-pressure (e.g. stop loading data from disk while rows were inserted into the database).

Pull streams are elegant and fun!

## Why did you port this library?

- To add quality type declarations throughout, and tweak the APIs to be more friendly to statically-typed usage and type inference.
- To make APIs that use Promises and async iteration. Internally, the structure of pull streams still works on callbacks and recursion, but sinks like [reduce](./lib/reduce.ts) now use Promises to play nicely with `await`.
- To make it compatible with ESM imports/Deno, including providing ready-to-go stream helpers that work with Deno's API and standard library.
- To learn more about how pull streams work by implementing them.

## Handbook of modules in this library

### Core API

- [types.ts](./lib/types.ts) describes the core abstractions of pull-streams with generic types.

### Sources

- [values.ts](./lib/values.ts) creates a Source from an array of values.

### Throughs

- [map.ts](./lib/map.ts) transforms each element in a stream, either keeping their type or returning an entirely new type.
- [take.ts](./lib/take.ts) takes a limited number of elements from a stream, converting an infinite stream into a finite one.

### Sinks

- [each.ts](./lib/each.ts) simply calls a callback on each element of the stream it encounters. If the callback returns a Promise, `each` will wait for the promise to resolve before continuing.
- [reduce.ts](./lib/reduce.ts) reduces all values of a stream into a single value, returning a Promise so you can `await` on the result.
- [iterate.ts](./lib/iterate.ts) converts a stream into an async iterator for use with `for await` syntax. See [examples/countdown.ts](./examples/countdown.ts).

## `pull` is missing!

A key feature of the pull-stream library is its `pull` helper function which can combine pull streams in an ergonomic fashion.
Instead of writing

```js
sink(through2(through1(source())))
```

the `pull` helper lets you write this:

```js
pull(
  source(),
  through1,
  through2,
  sink
)
```

It can even combine streams in a smart way, detecting their types by the number of arguments they take:

```js
let through = pull(through1, through2);
pull(
  source(),
  through,
  sink
)
```

I have decided not to try to port this function.
I _may_ create some kind of fluent 'builder' helper for those who really want a 'forwards' API, but I think it's fairly straightforward, and better for static typing, to stick with the more 'functional' interface.
Here's an example of composing throughs:

```typescript
let through1: Through<number> = filter(n => n > 10);
let through2 = take(5);
// pass the `s` argument explicitly:
let through = s => through2(through1(s));
sink(through(source()));
```

## Roadmap

- Implement more of the pull-stream library abstractions.
- Implement Deno specific library streams (e.g. a file reading stream, UTF-8 chunking, what else?).
- Tests!!
- Sort into folders like the pull-stream repo?
- Any API changes? Decide on whether sinks should use Promise internally, or loop like [drain](https://github.com/pull-stream/pull-stream/blob/master/sinks/drain.js)
