import { ClassicLevel } from 'classic-level';
import { runTest } from './run-test.js';

// Create a database
const db = new ClassicLevel('./sandbox/level', {
  // valueEncoding: 'json'
});

await runTest(db);
