export type End = null | true;

export type Sink<V> = (source: Source<V>) => void;

export type Source<V> = (end: End, cont: Cont<V> | null) => void;

export type Cont<V> = (end: End, value: V | undefined) => void;

export type Through<V, W = V> = (source: Source<V>) => Source<W>;
