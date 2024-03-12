import React, { useState, useContext } from "react";
import { createPortal } from "react-dom";
import { v4 as uuidv4 } from "uuid";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry";
import c from "./tasks.module.scss";
import { Data } from "../../providers/DataProvider";
import TaskCard from "./task-card/TaskCard";
const Tasks = () => {
  const { tasks, pots, createObject } = useContext(Data);

  //Handle pots
  const [newPot, setNewPot] = useState({
    pot_description: "",
    pot_id: "",
    pot_title: "",
  });

  const addPotHandler = () => {
    createObject("pot", {
      ...newPot,
      pot_id: uuidv4(),
    });
  };

  return (
    <>
      <div className={c.potsContainer}>
        {pots && (
          <ResponsiveMasonry
            columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}
          >
            <Masonry gutter={"2rem"}>
              {pots?.map((pot) => {
                return <TaskCard pot={pot} tasks={tasks} key={pot.pot_id} />;
              })}
            </Masonry>
          </ResponsiveMasonry>
        )}
        <button onClick={addPotHandler}>Add pot</button>
      </div>
    </>
  );
};
export default Tasks;
