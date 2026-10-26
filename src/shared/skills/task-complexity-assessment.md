# Task Complexity Assessment

Defines task type categories and complexity levels used by the task router.

## Task type categories

| Category | Description |
| --- | --- |
| Simple | Single-step task requiring minimal decision making. |
| Medium | Task requiring multiple steps or decision points. |
| Complex | Task with interdependencies, multiple decision points, or external system integration. |

## Complexity levels

| Level | Name | Characteristics |
| --- | --- | --- |
| 1 | Basic | Clear, straightforward logic, no dependencies. |
| 2 | Moderate | Conditional branching, one dependency or decision point. |
| 3 | High | Interdependencies, error handling, several decision points. |
| 4 | Very complex | External system integration, persistent state, many dependencies. |

## Scoring rules

Complexity starts at level 1 and is incremented (capped at 4) for each of:

- `dependencies.length > 0`
- `requiresExternalSystem === true`
- `decisionPoints.length > 2`

The resulting level determines the routing queue and priority:

| Level | Route | Priority |
| --- | --- | --- |
| 1 | simple-queue | low |
| 2 | medium-queue | medium |
| 3 | complex-queue | high |
| 4 | priority-queue | critical |
