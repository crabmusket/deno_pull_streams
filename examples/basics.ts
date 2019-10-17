import { Source, Sink, Cont, End } from "../lib/types.ts";

// Let's make our first pull stream pipeline: it will print all the values in
// an array to the console.

// We'll start by defining the Sink, the end-consumer of the data. Let's repeat
// the definition of Sink here, for ease of reading:
type _Sink<Value, Result = void> = (read: Source<Value>) => Result;

// A Sink is a function that takes one parameter, of type Source, and may produce
// a Result. We'll be specific, and just deal with numbers for now:
function logNumbers(read: Source<number>): void {
  // Sinks control the flow of pull-streams by calling the `read` function as often
  // as they like. Let's call it immediately to start the flow of data. When we
  // call `read`, we can pass a first parameter to stop the flow and terminate
  // the source; but we don't do that, because we want more data! The second
  // parameter is a callback that the source will call when it has some data
  // ready for us.
  read(null, function continuation(end, value) {
    // When the continuation is called, either `end` or `value` will be passed.
    // We check `end` first to see if the source is out of data.
    if (end) {
      console.log("no more numbers to print!");
      return;
    }

    if (!value) {
      // This is an illegal call, and it means a programmer has made an error!
      throw new Error("continuation called without end or value");
    }

    // Perform the actual work our sink is meant for: logging the data!
    console.log(value);

    // If we were to leave things here, only one value would ever be printed. But
    // we want this Sink to log ALL the values it can, so we're going to call read
    // again! We use a recursive reference to this same continuation, so we'll
    // keep doing the same work for every value that we read.
    defer(() => read(null, continuation));
    // We use defer() so that the call to `read` isn't actually recursive. This
    // avoids stack overflows when you are reading from a synchronous Source.
  });
}

function defer(op: () => void) {
  setTimeout(op, 0);
}

// All right, our Sink is ready, but what about the Source? Let's write it now.
// We're going to create a source that counts from 1 to 10. A Source is, as we saw
// above, a function that takes a continuation to call when it has some data. The
// type is repeated here for your reading pleasure:
type _Source<Value> = (end: End, cont: Cont<Value>) => void;

// Because the Source has some state we need to initialise, this function will
// RETURN a new Source:
function countToTen(): Source<number> {
  // Initialise the counter
  let counter = 1;
  return function source(end: End, cont: Cont<number>): void {
    // The source function can be called with either `end` or `cont` defined.
    if (end) {
      // `end` signals that the consumer wants to stop consuming. We don't actually
      // have anything to do here, but more complicated Sources might want to e.g.
      // close file handles, terminate websocket connections, and so on.
      return;
    }

    // Since this source only counts to 10, once we reach it, we call `cont` with
    // the first parameter. This signals to the consumer that there is no more data!
    if (counter > 10) {
      cont(true, undefined);
      return;
    }

    // Call the continuation with the current counter value.
    const currentValue = counter;
    defer(() => cont(null, currentValue));
    // In this case, we use defer() so that we can increment the counter before
    // the Sink reads our next value. It won't actually be a problem in this
    // specific case, since we know our Sink is asynchronous. But it pays to be
    // careful, and make both Sources and Sinks asynchronous.
    counter += 1;
  };
}

// All right, now we have a simple Sink and simple Source. Let's wire them together
// and see what happens:

let numbers = countToTen();
logNumbers(numbers);

// Thanks for reading this far! Now go forth and pull some streams! If you have
// any feedback, please get in touch in the Github issues.
