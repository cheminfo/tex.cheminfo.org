import { effect } from '@preact/signals-react';

/**
 * Rehydrate a bucket of signals from one namespaced localStorage entry, and
 * re-serialize the whole bucket whenever any leaf changes.
 *
 * Best-effort on both sides: a page framed in a course may have no storage at
 * all — third-party storage is partitioned in Chrome and blocked in Safari —
 * and losing a preference must never break the page.
 * @param key - Namespaced and versioned localStorage key.
 * @param bucket - Plain object whose leaves are signals.
 * @returns The same bucket, rehydrated and kept in sync with storage.
 */
export function persistBucket<T extends object>(key: string, bucket: T): T {
  try {
    const stored = globalThis.localStorage?.getItem(key);
    if (stored) rehydrate(bucket, JSON.parse(stored));
  } catch {
    // Malformed or inaccessible storage: start from the defaults.
  }
  effect(() => {
    const serialized = JSON.stringify(serialize(bucket));
    try {
      globalThis.localStorage?.setItem(key, serialized);
    } catch {
      // Quota exceeded: the preference simply does not survive the reload.
    }
  });
  return bucket;
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

function rehydrate(node: object, stored: unknown): void {
  if (typeof stored !== 'object' || stored === null) return;
  for (const [property, leaf] of Object.entries(node)) {
    const storedValue = (stored as Record<string, unknown>)[property];
    if (storedValue === undefined) continue;
    if (isSignalLeaf(leaf)) {
      leaf.value = storedValue;
    } else if (typeof leaf === 'object') {
      rehydrate(leaf as object, storedValue);
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
