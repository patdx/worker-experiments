import test from 'tape';
import suite from 'abstract-level/test/index.js';
import { CloudflareKvLevel } from '../index.js';
import { temporaryDirectory } from 'tempy';

suite({
  test,
  factory(options) {
    return new CloudflareKvLevel(temporaryDirectory(), options);
  },
});
