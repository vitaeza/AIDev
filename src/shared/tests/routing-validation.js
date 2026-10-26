const assert = require('assert');
const taskRouting = require('../hooks/task-routing');

// Test cases for routing validation
const testCases = [
  {
    name: 'simple task routes to simple-queue',
    task: {
      type: 'simple',
      dependencies: [],
      requiresExternalSystem: false,
      decisionPoints: []
    },
    expected: { route: 'simple-queue', priority: 'low' }
  },
  {
    name: 'task with one dependency routes to medium-queue',
    task: {
      type: 'medium',
      dependencies: [1],
      requiresExternalSystem: false,
      decisionPoints: [1]
    },
    expected: { route: 'medium-queue', priority: 'medium' }
  },
  {
    name: 'task with external system routes to complex-queue',
    task: {
      type: 'complex',
      dependencies: [1, 2],
      requiresExternalSystem: true,
      decisionPoints: [2, 3]
    },
    expected: { route: 'complex-queue', priority: 'high' }
  },
  {
    name: 'fully loaded task routes to priority-queue',
    task: {
      type: 'critical',
      dependencies: [1, 2, 3],
      requiresExternalSystem: true,
      decisionPoints: [3, 4, 5]
    },
    expected: { route: 'priority-queue', priority: 'critical' }
  },
  {
    name: 'task without type defaults to unknown',
    task: {},
    expected: { route: 'simple-queue', priority: 'low' }
  }
];

let failures = 0;

testCases.forEach((testCase, index) => {
  const result = taskRouting.routeTask(testCase.task);
  try {
    assert.deepStrictEqual(result, testCase.expected);
    console.log(`Test ${index + 1}: PASS - ${testCase.name}`);
  } catch (error) {
    failures += 1;
    console.error(`Test ${index + 1}: FAIL - ${testCase.name}`);
    console.error(`  expected: ${JSON.stringify(testCase.expected)}`);
    console.error(`  actual:   ${JSON.stringify(result)}`);
  }
});

// Complexity scoring checks
const complexityCases = [
  { task: { type: 'simple' }, expectedLevel: 1 },
  { task: { type: 'medium', dependencies: [1] }, expectedLevel: 2 },
  { task: { type: 'complex', dependencies: [1], requiresExternalSystem: true }, expectedLevel: 3 },
  {
    task: { type: 'critical', dependencies: [1], requiresExternalSystem: true, decisionPoints: [1, 2, 3] },
    expectedLevel: 4
  }
];

complexityCases.forEach((testCase, index) => {
  const complexity = taskRouting.determineComplexity(testCase.task);
  try {
    assert.strictEqual(complexity.level, testCase.expectedLevel);
    console.log(`Complexity ${index + 1}: PASS - level ${complexity.level}`);
  } catch (error) {
    failures += 1;
    console.error(`Complexity ${index + 1}: FAIL - expected level ${testCase.expectedLevel}, got ${complexity.level}`);
  }
});

if (failures > 0) {
  console.error(`\n${failures} check(s) failed.`);
  process.exit(1);
}

console.log('\nAll routing validation tests completed successfully.');
