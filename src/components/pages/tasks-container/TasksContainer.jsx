import React, { useContext, useEffect, useState } from "react";
import c from "./tasks-container.module.scss";
import { v4 as uuidv4 } from "uuid";
import { Data } from "../../providers/DataProvider";
import TaskCard from "./task-card/TaskCard";
import Icon from "../../../assets/Icon";

// import classNames from "classnames";

const TasksContainer = () => {
  const { tasks, pots, createObject } = useContext(Data);
  // Handle selected pot
  const [selectedPot, setSelectedPot] = useState(0);

  const [newPot, setNewPot] = useState({
    pot_description: "",
    pot_id: "",
    pot_title: "Untitled",
  });

  const addPotHandler = () => {
    createObject("pot", {
      ...newPot,
      pot_id: uuidv4(),
    });
  };

  // Create an object to store task counts for each pot

  const [taskCountByPot, setTaskCountByPot] = useState();
  useEffect(() => {
    const countTasksByPot = () => {
      const counts = {};
      tasks?.forEach((task) => {
        if (!counts[task.task_pot_id]) {
          counts[task.task_pot_id] = {
            total: 0,
            completed: 0,
          };
        }
        counts[task.task_pot_id].total++;
        if (task.task_is_complete === "True") {
          counts[task.task_pot_id].completed++;
        }
      });
      return counts;
    };

    setTaskCountByPot(countTasksByPot());
  }, [tasks]);

  return (
    <div className={c.pageContainer}>
      <div className={c.tasksContainer}>
        <div className={c.potsContainer}>
          <ul className={c.pots}>
            {pots?.map((pot, index) => (
              <li
                className={[c.pot, selectedPot === index && c.selected].join(
                  " "
                )}
                key={index}
                onClick={() => setSelectedPot(index)}
              >
                <span>{pot?.pot_title}</span>
                <span className={c.number}>
                  {taskCountByPot && taskCountByPot[pot?.pot_id]
                    ? taskCountByPot[pot.pot_id].completed
                    : 0}
                  /
                  {taskCountByPot && taskCountByPot[pot?.pot_id]
                    ? taskCountByPot[pot.pot_id].total
                    : 0}
                </span>
              </li>
            ))}
          </ul>
          <button onClick={addPotHandler} className={c.addNew}>
            <Icon.Add size={16} />
          </button>
        </div>
        <div className={c.todos}>
          {pots && (
            <TaskCard
              pot={pots[selectedPot]}
              tasks={tasks}
              key={pots[selectedPot]?.pot_id}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TasksContainer;
