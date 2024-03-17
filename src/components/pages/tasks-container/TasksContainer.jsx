import React, { useContext, useState } from "react";
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
                {pot.pot_title}
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
              key={pots[selectedPot].pot_id}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default TasksContainer;
