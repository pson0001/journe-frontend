import React, { useContext, useEffect, useState } from "react";
import { Data } from "../../providers/DataProvider";
import c from "./home.module.scss";
import Garden from "./garden/Garden";
import taskFilter from "../../utils/filter/task-filter";
import { createPortal } from "react-dom";
import TaskItem from "../tasks/task-item/TaskItem";
const Home = () => {
  // Load data
  const { tasks, pots } = useContext(Data);
  const [openModal, setOpenModal] = useState(false);

  const [unFinishedTasks, setUnFinishedTasks] = useState([]);
  useEffect(() => {
    if (taskFilter(tasks)) {
      setUnFinishedTasks(taskFilter(tasks));
      setOpenModal(true);
    }
  }, [tasks]);
  // Draw garden
  return (
    <div className={c.pageContainer}>
      {openModal &&
        createPortal(
          <div className={c.modalContainer}>
            <div className={c.modalCard}>
              <h2>Unfinished Tasks</h2>
              {unFinishedTasks?.map((task) => {
                return (
                  <TaskItem
                    task={task}
                    potId={task.task_pot_id}
                    key={task.task_pot_id}
                  />
                );
              })}

              <button onClick={() => setOpenModal(!openModal)}>Close</button>
            </div>
          </div>,
          document.getElementById("root")
        )}

      <Garden data={{ tasks, pots }} />
    </div>
  );
};

export default Home;
