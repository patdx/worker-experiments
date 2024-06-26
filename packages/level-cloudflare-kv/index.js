import {
  AbstractLevel,
  // AbstractSublevel,
  // AbstractIterator,
  // AbstractKeyIterator,
  // AbstractValueIterator,
  // AbstractChainedBatch,
} from 'abstract-level';

import { KVNamespace } from '@miniflare/kv';
import { FileStorage } from '@miniflare/storage-file';
import ModuleError from 'module-error';

export class CloudflareKvLevel extends AbstractLevel {
  /** @type {KVNamespace} */
  ns;

  // This in-memory example doesn't have a location argument
  constructor(path, options) {
    console.log(`constructor`, path);
    // Declare supported encodings
    const encodings = { utf8: true };

    // Call AbstractLevel constructor
    super({ encodings }, options);

    // './sandbox/cloudflare-kv'
    // Create a map to store entries
    this.ns = new KVNamespace(new FileStorage(path));
  }

  _open(options, callback) {
    console.log('_open');
    // Here you would open any necessary resources.
    // Use nextTick to be a nice async citizen
    this.nextTick(callback);
  }

  _put(key, value, options, callback) {
    console.log('_put', key);
    this.ns
      .put(key, value)
      .then(() => {
        this.nextTick(callback, null);
      })
      .catch((err) => this.nextTick(callback, err));
  }

  _get(key, options, callback) {
    console.log('_get', key);
    this.ns
      .get(key)
      .then((value) => {
        if (value === undefined || value === null) {
          return this.nextTick(
            callback,
            new ModuleError(`Key ${key} was not found`, {
              code: 'LEVEL_NOT_FOUND',
            })
          );
        } else {
          this.nextTick(callback, null, value);
        }
      })
      .catch((err) => this.nextTick(callback, err));
  }

  _del(key, options, callback) {
    console.log('_del', key);
    this.ns
      .delete(key)
      .then(() => this.nextTick(callback))
      .catch((err) => this.nextTick(callback, err));
  }

  _batch(/** @type {any[]} */ operations, options, callback) {
    console.log('_batch', JSON.stringify(operations));
    Promise.all(
      operations.map(async (op, index) => {
        if (op.type === 'put') {
          // to support official test suite, a "del" operation that follows "put"
          // for the same key should override the "del"
          const foundIndex = operations.findIndex(
            (item, itemIndex) =>
              itemIndex >= index && item.key === op.key && item.type === 'del'
          );
          if (foundIndex >= 0) {
            console.log(
              `found an op that would replace this one, skipipng put ${op.key}`
            );
          } else {
            await this.ns.put(op.key, op.value);
          }
        } else {
          await this.ns.delete(op.key);
          console.log(`deleted`, op.key);
        }
      })
    )
      .then(() => this.nextTick(callback))
      .catch((err) => this.nextTick(callback, err));
  }
}
