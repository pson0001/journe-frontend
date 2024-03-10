import { stringToBoolean } from "./utils";
const taskFilter = (tasks) => {
  const currentTime = new Date();

  const unFinishedTasks = [];
  tasks?.map((task) => {
    if (
      !stringToBoolean(task.task_is_complete) &&
      new Date(task.task_start_time) <= currentTime
    ) {
      unFinishedTasks.push(task);
    }
  });

  return unFinishedTasks;
};

export default taskFilter;
