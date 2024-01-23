import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IoIosCheckmarkCircle, IoMdRadioButtonOff, IoIosTrash, IoIosSend } from "react-icons/io";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/tasks', { withCredentials: true });
      setTasks(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addTask = () => {
    axios.post('http://localhost:5000/tasks', { title: newTask })
      .then(response => {
        setTasks([...tasks, response.data]);
        setNewTask('');
      })
      .catch(error => console.error(error));
  };

  const enterKey = (event) => {
    if (event.key === 'Enter') {
      addTask();
    }
  };

  const doneTask = (id) => {
    axios.get(`http://localhost:5000/tasks/${id}`)
    .then(response => {
      const currentTask = response.data;

      return axios.patch(`http://localhost:5000/tasks/${id}`, { completed: !currentTask.completed });
    })
    .then(response => {
      setTasks(tasks.map(task => (task.id === id ? response.data : task)));
      fetchData();
    })
    .catch(error => console.error(error)); 
  };

  const dropTask = (id) => {
    axios.delete(`http://localhost:5000/tasks/${id}`)
      .then(() => {
        setTasks(tasks.filter(task => task.id !== id));
        fetchData();
      })
      .catch(error => console.error(error)); 
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <h1 style={{marginLeft: 30}}>ToDo List</h1>
      <div style={{ overflowY: 'auto', flex: 1 }}>
        <ul style={{listStyle: "none", justifyContent: "center", alignItems: "center"}}>
          {tasks.map((task, index) => (
            task.completed? null:
            <div key={index} style={{display: "flex", flexDirection: "row", alignSelf: "center", textAlign: "center"}}>
              <li style={{marginRight: 5, cursor: "pointer"}} onClick={() => doneTask(task._id)}><IoMdRadioButtonOff color='green' size={30} /></li>
              <li style={{fontSize: 24, marginTop: -4}} key={task._id}>{task.title}</li>
            </div>
          ))}
        </ul>
        <div style={{marginLeft: 50, marginRight: 50, background: "#00000010", maxWidth: "100%", height: 5, borderRadius: 10}} />
        <ul style={{listStyle: "none", justifyContent: "center", alignItems: "center"}}>
          {tasks.map((task, index) => (
            !task.completed? null:
            <div key={index} style={{display: "flex", flexDirection: "row", alignSelf: "center", textAlign: "center"}}>
              <li style={{marginRight: 5, cursor: "pointer"}} onClick={() => doneTask(task._id)}><IoIosCheckmarkCircle color='green' size={30} /></li>
              <li style={{fontSize: 24, marginTop: -4}} key={task._id}><s>{task.title}</s></li>
              <li style={{marginLeft: 20, alignSelf: "center", cursor: "pointer"}} onClick={() => dropTask(task._id)}><IoIosTrash color='red' size={20} /></li>
            </div>
          ))}
        </ul>
      </div>
      <div style={{display: "flex", flexDirection: "row", marginBottom: 10, marginTop: 30, width: "100%", justifyContent: "center", alignContent: "center"}}>
          <div style={{display: "flex", flexDirection: "row", height: 40, width: 620, background: "#000000E0", justifyContent: "center", alignContent: "center", borderRadius: 25, padding: 10 }}>
            <input
              type="text"
              style={{width: "100%", borderStyle: "none", outlineStyle: "none", fontSize: 20, background: "transparent", color: "white"}}
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={enterKey}
            />
            <IoIosSend onClick={addTask} size={32} color='white' style={{ margin: 10, alignSelf: "center", cursor: "pointer"}} />
        </div>
      </div>
    </div>
  );
}

export default App;
