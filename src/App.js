import React, { useState, useEffect } from 'react';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import Timer from './components/Timer';
import './App.css';
import { v4 as uuidv4 } from 'uuid';

function App() {
  const [tasks, setTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('tasks'));
    if (storedTasks) {
      setTasks(storedTasks.filter((task) => !task.completed));
      setCompletedTasks(storedTasks.filter((task) => task.completed));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify([...tasks, ...completedTasks]));
  }, [tasks, completedTasks]);

  const addTask = (newTask) => {
    const taskWithId = { ...newTask, id: uuidv4(), completed: false };
    setTasks([...tasks, taskWithId]);
  };

  const deleteTask = (taskId) => {
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    const updatedCompletedTasks = completedTasks.filter((task) => task.id !== taskId);
    setTasks(updatedTasks);
    setCompletedTasks(updatedCompletedTasks);
  };

  const editTask = (taskId, updatedTask) => {
    const updatedTasks = tasks.map((task) =>
      task.id === taskId ? { 
        ...task, 
        description: updatedTask.description, 
        deadline: updatedTask.deadline 
      } : task
    );
    setTasks(updatedTasks);
  };

  const completeTask = (taskId) => {
    const taskToComplete = tasks.find((task) => task.id === taskId);
    const updatedTasks = tasks.filter((task) => task.id !== taskId);
    taskToComplete.completed = true;
    setTasks(updatedTasks);
    setCompletedTasks([...completedTasks, taskToComplete]);
  };

  const handleDragStart = (ev, id) => {
    ev.dataTransfer.setData('id', id);
  };

  const handleDragOver = (ev) => {
    ev.preventDefault();
  };

  const handleDrop = (ev, index) => {
    const sourceId = ev.dataTransfer.getData('id');
    const sourceIndex = tasks.findIndex((task) => task.id === sourceId);
    const updatedTasks = [...tasks];
    const [removed] = updatedTasks.splice(sourceIndex, 1);
    updatedTasks.splice(index, 0, removed);
    setTasks(updatedTasks);
  };

  const handleSelectTask = (taskId) => {
    setSelectedTaskId(taskId);
  };

  return (
    <div className="App">
      <h1>TaskApp</h1>
      <TaskForm onAddTask={addTask} />
      <TaskList
        tasks={tasks}
        onDeleteTask={deleteTask}
        onEditTask={editTask}
        onCompleteTask={completeTask}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onSelectTask={handleSelectTask}
      />
    </div>
  );
}

export default App;


