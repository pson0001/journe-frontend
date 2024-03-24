import React, { useState, useEffect, createContext } from "react";

import isEqual from "lodash/isEqual";
// @ts-ignore
export const Data = React.createContext();

const DataProvider = ({ children }) => {
  // Init all states
  const [tasks, setTasks] = useState(null);
  const [pots, setPots] = useState(null);
  const [blocks, setBlocks] = useState(null);
  const [data, setData] = useState(null);
  const [localData, setLocalData] = useState();

  const fetchData = async () => {
    try {
      const response = await fetch(
        `https://canyknoxvile.pythonanywhere.com/get_all_journe_data`,
        {
          method: "GET",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const data = await response.json();
      const dataResponse = await data.response;
      setData(dataResponse);

      if (response.ok) {
        if (!isEqual(localData, dataResponse)) {
          //Update local storage
          localStorage.setItem("journe", JSON.stringify(dataResponse));
          setLocalData(dataResponse);
        }
        // Handle success if needed
      } else {
        console.error("Request failed:", response.status, response.statusText);
        // Handle errors if needed
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  // On first load
  useEffect(() => {
    fetchData();
  }, []);

  // On first load, use local storage first
  useEffect(() => {
    const localData = localStorage.getItem("journe");
    const localDataJson = JSON.parse(localData);
    setLocalData(localDataJson);
  }, []);

  useEffect(() => {
    setTasks(localData?.tasks);
    setPots(localData?.pots);
    setBlocks(localData?.blocks);
  }, [localData]);
  // Clear db
  async function clearDB() {
    await fetch(`https://canyknoxvile.pythonanywhere.com/reset_db`, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    });
    await fetchData();
  }

  async function loadDummy() {
    await fetch(`https://canyknoxvile.pythonanywhere.com/load_dummy_json`, {
      method: "GET",
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
    });
    await fetchData();
  }

  // Create new object
  async function createObject(objectType, body) {
    try {
      // Save the created object locally
      const localData = localStorage.getItem("journe");
      const newData = localData ? JSON.parse(localData) : {};

      switch (objectType) {
        case "task":
          newData["tasks"] = [...(newData["tasks"] || []), body];
          localStorage.setItem("journe", JSON.stringify(newData));
          setLocalData(newData);
        case "pot":
          newData["pots"] = [...(newData["pots"] || []), body];
          localStorage.setItem("journe", JSON.stringify(newData));
          setLocalData(newData);
      }

      const response = await fetch(
        `https://canyknoxvile.pythonanywhere.com/create/${objectType}`,
        {
          method: "POST",
          mode: "cors",
          body: JSON.stringify(body),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        await fetchData();
        // Handle success if needed
      } else {
        console.error("Request failed:", response.status, response.statusText);
        // Handle errors if needed
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  // Update an object
  async function updateObject(objectType, id, body) {
    try {
      // // Save the created object locally
      const localData = localStorage.getItem("journe");
      const newData = localData ? JSON.parse(localData) : {};

      switch (objectType) {
        case "task":
          const tasksToUpdate = newData["tasks"] || [];
          const updatedTask = tasksToUpdate.map((obj) =>
            obj.task_id === id ? body : obj
          );
          newData["tasks"] = updatedTask;
          localStorage.setItem("journe", JSON.stringify(newData));
          setLocalData(newData);
        case "pot":
          const potsToUpdate = newData["pots"] || [];
          const updatedObjects = potsToUpdate.map((obj) =>
            obj.pot_id === id ? body : obj
          );
          newData["pots"] = updatedObjects;
          localStorage.setItem("journe", JSON.stringify(newData));
          setLocalData(newData);
      }

      const response = await fetch(
        `https://canyknoxvile.pythonanywhere.com/update/${objectType}/${id}`,
        {
          method: "POST",
          mode: "cors",
          body: JSON.stringify(body),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        await fetchData();
        // Handle success if needed
      } else {
        console.error("Request failed:", response.status, response.statusText);
        // Handle errors if needed
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  // Delete an object
  async function deleteObject(objectType, id) {
    try {
      const localData = localStorage.getItem("journe");
      const newData = localData ? JSON.parse(localData) : {};

      switch (objectType) {
        case "task":
          const tasksToUpdate = newData["tasks"] || [];
          const updatedTask = tasksToUpdate.filter(
            (item) => item.task_id !== id
          );
          newData["tasks"] = updatedTask;
          localStorage.setItem("journe", JSON.stringify(newData));
          setLocalData(newData);
        case "pot":
          const potsToUpdate = newData["pots"] || [];
          const updatedObjects = potsToUpdate.filter(
            (item) => item.pot_id !== id
          );
          newData["pots"] = updatedObjects;
          localStorage.setItem("journe", JSON.stringify(newData));
          setLocalData(newData);
      }

      const response = await fetch(
        `https://canyknoxvile.pythonanywhere.com/remove/${objectType}/${id}`,
        {
          method: "DELETE",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        await fetchData();
        // Handle success if needed
      } else {
        console.error("Request failed:", response.status, response.statusText);
        // Handle errors if needed
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }
  return (
    <Data.Provider
      value={{
        tasks,
        pots,
        blocks,
        setTasks,
        clearDB,
        loadDummy,
        createObject,
        deleteObject,
        updateObject,
      }}
    >
      {children}
    </Data.Provider>
  );
};

export default DataProvider;
