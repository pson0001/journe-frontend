import React, { useState, useRef, useEffect, useContext } from "react";
import c from "./schedule-full-calendar.module.scss";
import { Calendar } from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Data } from "../../providers/DataProvider";
import { createPortal } from "react-dom";
import TaskItem from "../tasks/task-item/TaskItem";
import dayjs from "dayjs";
import { v4 as uuidv4 } from "uuid";

function Schedule() {
  const { tasks, pots, createObject } = useContext(Data);
  const tasksFullCalendar = tasks?.map((task) => ({
    title: task.task_title,
    start: task.task_start_time,
    id: task.task_id,
    pot_id: task.task_pot_id,
    end: new Date(
      new Date(task.task_start_time).getTime() + task.task_duration * 60000
    ), // Convert duration to milliseconds and add to start time
    allDay: false,
  }));

  const calendarRef = useRef();
  const [openModal, setOpenModal] = useState(false);

  const [clickedEventId, setClickedEventId] = useState();
  const handleViewTask = (event) => {
    setOpenModal(true);
    setClickedEventId(event.id);
  };
  const [newTaskPotId, setNewTaskPotId] = useState(pots && pots[0]?.pot_id);

  // Create new task object
  const [newTask, setNewTask] = useState({
    task_description: "",
    task_start_time: dayjs(new Date()),
    task_duration: 10,
    task_id: "",
    task_title: "",
    task_is_complete: "false",
    task_pot_id: newTaskPotId,
  });

  const [isNewTask, setIsNewTask] = useState(false);

  const createEmptyTaskHandler = (info) => {
    const tempId = uuidv4();
    setNewTask({
      ...newTask,
      task_id: tempId,
      task_start_time: dayjs(new Date(info.dateStr)),
    });
    createObject("task", {
      ...newTask,
      task_id: tempId,
      task_start_time: dayjs(new Date(info.dateStr)),
    });
  };
  const addNewTask = (info) => {
    setOpenModal(true);
    setIsNewTask(true);
    createEmptyTaskHandler(info);

    // setNewTask({ ...newTask, task_start_time: dayjs(new Date(info.dateStr)) });
  };

  useEffect(() => {
    const calendar = new Calendar(calendarRef.current, {
      plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin], // Include required plugins here
      initialView: "timeGridWeek",
      headerToolbar: {
        left: "title",

        right: "today prev,next timeGridWeek,timeGridDay",
      },
      editable: true,
      droppable: true,
      dayMaxEvents: true,
      events: tasksFullCalendar,
      allDaySlot: false,
      nowIndicator: true,
      eventColor: "var(--background-color)",
      eventClick: function (info) {
        handleViewTask(info.event);
      },
      dateClick: function (info) {
        addNewTask(info);
      },
    });

    calendar.render();

    return () => {
      calendar.destroy(); // cleanup when component unmounts
    };
  }, [tasks]); // empty dependency array to run effect only once after initial render

  return (
    <div className={c.scheduleContainer}>
      {openModal &&
        createPortal(
          <div className={c.modalContainer}>
            <div className={c.modalCard}>
              {isNewTask ? (
                <div>
                  <select
                    name="pots"
                    id="pots"
                    value={newTaskPotId}
                    onChange={(e) => {
                      handlePotChange(e);
                      setNewTaskPotId(e.target.value);
                    }}
                  >
                    {pots?.map((pot) => (
                      <option value={pot.pot_id} key={pot.pot_id}>
                        {pot.pot_title}
                      </option>
                    ))}
                  </select>
                  <TaskItem
                    task={newTask}
                    potId={newTaskPotId}
                    key={newTask.task_id}
                  />
                </div>
              ) : (
                tasks?.map((task) => {
                  if (task.task_id === clickedEventId) {
                    return <TaskItem task={task} potId={task.task_pot_id} />;
                  }
                })
              )}
              <button onClick={() => setOpenModal(!openModal)}>Close</button>
            </div>
          </div>,
          document.getElementById("root")
        )}

      <div ref={calendarRef}></div>
    </div>
  );
}

export default Schedule;
