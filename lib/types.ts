/**
 * End is the signal propagated (either upwards or downwards) to end the stream.
 * `null` means "continue as normal".
 * `true` means "no more data" (from a Source) or "finished consuming" (from a Sink).
 * `Error` signals there was some error.
 */
export type End = null | true | Error;

/**
 * A Sink is the 'controller' of the stream's flow: it asks for values then
 * decides what to do with them.
 */
export type Sink<V, R = void> = (read: Source<V>) => R;

/** A Source is a producer of values for a pull stream. */
export type Source<V> = (end: End, next: Cont<V> | null) => void;

/** A Cont (continuation) is a callback that receives data from a source. */
export type Cont<V> = (end: End, value: V | undefined) => void;

/**
 * A Through is a transformer from Source to Source. It might change the type of
 * the data that flows through it from V to W.
 */
export type Through<V, W = V> = (read: Source<V>) => Source<W>;
