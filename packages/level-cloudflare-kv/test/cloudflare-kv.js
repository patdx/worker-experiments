import { CloudflareKvLevel } from '../index.js';
import { runTest } from './run-test.js';

// Create a database
const db = new CloudflareKvLevel({
  // valueEncoding: 'json'
});

await runTest(db);
