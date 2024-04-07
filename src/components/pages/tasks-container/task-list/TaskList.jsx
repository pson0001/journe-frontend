import React from "react";
import c from "./task-list.module.scss";
import TaskItem from "../task-item/TaskItem";
const TaskList = ({ tasks, pot }) => {
  const sortedTasks = tasks.sort((task1, task2) => {
    return task1.task_start_time.localeCompare(task2.task_start_time);
  });

  return (
    <div className={c.listContainer}>
      {sortedTasks?.map((task, i) => {
        if (task?.task_pot_id === pot?.pot_id) {
          return <TaskItem key={i} task={task} potId={pot?.pot_id} />;
        }
      })}
    </div>
  );
};

export default TaskList;
