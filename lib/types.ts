/**
 * A Source is a producer of values for a pull stream. It is a function that you
 * may call in one of two ways:
 * 1. Provide the first parameter, `end`, to signal that no more values will be
 *    requested from this source. This lets a consumer terminate a producer.
 * 2. Provide the second parameter, `cont`, a continuation to be called when the
 *    source produces its next value.
 * Sources are designed to be asynchronous by nature. Therefore the only way to
 * "pull" data from them is by passing a continuation.
 */
export type Source<Value> = (end: End, cont: Cont<Value>) => void;

/**
 * A Cont (continuation) is a callback that receives data from a Source. It may,
 * however, be called with an End value, if the Source has run out of values.
 */
export type Cont<Value> = (end: End, value: Value | undefined) => void;

/**
 * A Sink is a function that "consumes" a Source and may produce a Result at some
 * point. Sinks are in control of the stream's flow: they must call the `read`
 * function to receive a new value each time they want one. They control the pacing
 * of data flow.
 */
export type Sink<Value, Result = void> = (read: Source<Value>) => Result;

/**
 * A Through is a transformer from Source to Source. It might change the type of
 * the data that flows through it from Before to After.
 */
export type Through<Before, After = Before> = (read: Source<Before>) => Source<After>;

/**
 * End is the signal propagated to end the stream. Sources, Sinks, and Throughs
 * can all cause a pull stream to terminate by passing an end signal.
 * `null` means "continue as normal".
 * `true`, when passed to a Source, means "the consumer requires no more values";
 * and when passed to a Sink, it means "the source has no more values".
 * `Error` signals there was some error.
 */
export type End = null | true | Error;
