const taskRouting = {
  routeTask: function (task) {
    // Determine task complexity based on type and required resources
    const complexity = this.determineComplexity(task);

    // Route based on complexity level
    switch (complexity.level) {
      case 1:
        return { route: 'simple-queue', priority: 'low' };
      case 2:
        return { route: 'medium-queue', priority: 'medium' };
      case 3:
        return { route: 'complex-queue', priority: 'high' };
      case 4:
        return { route: 'priority-queue', priority: 'critical' };
      default:
        return { route: 'default-queue', priority: 'low' };
    }
  },

  determineComplexity: function (task) {
    let level = 1;

    // Check for interdependencies
    if (task.dependencies && task.dependencies.length > 0) {
      level = Math.min(4, level + 1);
    }

    // Check for external system integration
    if (task.requiresExternalSystem) {
      level = Math.min(4, level + 1);
    }

    // Check for decision points
    if (task.decisionPoints && task.decisionPoints.length > 2) {
      level = Math.min(4, level + 1);
    }

    return { level, type: task.type || 'unknown' };
  }
};

// Export the routing module
module.exports = taskRouting;
