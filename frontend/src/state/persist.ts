import { effect } from '@preact/signals-react';
import { persistBucket } from 'react-cheminfo/core';

/**
 * Rehydrate a tree of signals from one namespaced localStorage entry, and
 * re-serialize the whole tree whenever any leaf changes.
 *
 * The entry itself — its version suffix, the reads that may find nothing and
 * the writes a full store refuses — is the ecosystem's `persistBucket`; what
 * is added here is the binding to signals, which it knows nothing about.
 * @param key - Name of the bucket, namespaced by the site and without its
 * version.
 * @param tree - Plain object whose leaves are signals.
 * @returns The same tree, rehydrated and kept in sync with storage.
 */
export function persistSignals<T extends object>(key: string, tree: T): T {
  const bucket = persistBucket({ key, defaults: serialize(tree) });
  rehydrate(tree, bucket.read().value);
  effect(() => {
    bucket.write(serialize(tree));
  });
  return tree;
}

interface SignalLeaf {
  value: unknown;
  peek: () => unknown;
}

function isSignalLeaf(value: unknown): value is SignalLeaf {
  return (
    typeof value === 'object' &&
    value !== null &&
    'value' in value &&
    'peek' in value
  );
}

function rehydrate(node: object, stored: Record<string, unknown>): void {
  for (const [property, leaf] of Object.entries(node)) {
    const storedValue = stored[property];
    if (storedValue === undefined) continue;
    if (isSignalLeaf(leaf)) {
      leaf.value = storedValue;
    } else if (typeof leaf === 'object') {
      rehydrate(leaf as object, storedValue as Record<string, unknown>);
    }
  }
}

function serialize(node: object): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [property, leaf] of Object.entries(node)) {
    if (isSignalLeaf(leaf)) {
      result[property] = leaf.value;
    } else if (typeof leaf === 'object' && leaf !== null) {
      result[property] = serialize(leaf as object);
    }
  }
  return result;
}
