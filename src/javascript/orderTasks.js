export const orderTasks = (tasks, taskSubset) => {
  if (!tasks.length || !taskSubset.length) {
    return [];
  }

  const aggregateTaskDeps = (deps) => {
    if (!deps) {
      return [];
    }

    if (deps.length === 1) {
      const taskString = deps[0];

      let orderedDeps = [];

      depMap[taskString].map((td) => {
        const subtaskDeps = depMap[td].length
          ? aggregateTaskDeps(depMap[td])
          : [];

        if (subtaskDeps.length) {
          depMap[td] = subtaskDeps;

          subtaskDeps.map((d) => {
            if (!orderedDeps.includes(d)) {
              const filteredTasks = tasks.filter(
                (t) => t.task === d || orderedDeps.includes(t.task)
              );

              orderedDeps = orderTasks(filteredTasks, [d, ...orderedDeps]);
            }
          });
        }

        orderedDeps.push(td);
      });

      return orderedDeps.length ? [...orderedDeps, taskString] : [taskString];
    }

    return [
      ...aggregateTaskDeps([deps[0]]),
      ...aggregateTaskDeps(deps.slice(1)),
    ];
  };

  const depMap = {};

  for (var task of tasks) {
    depMap[task.task] = task.dependencies;
  }

  let orderedDeps = [];

  taskSubset.map((st) => {
    if (!orderedDeps.includes(st) && Object.keys(depMap).includes(st)) {
      const subtaskDeps = depMap[st]?.length
        ? aggregateTaskDeps(depMap[st])
        : [];

      if (subtaskDeps.length) {
        subtaskDeps.map((st) => {
          if (!orderedDeps.includes(st)) {
            orderedDeps.push(st);
          }
        });
      }

      orderedDeps.push(st);
    }
  });

  return orderedDeps;
};
