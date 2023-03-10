import React, { useState, useEffect } from "react";
import Task from "./Task";
import Timer from "./Timer";

function TaskList({
  tasks,
  onDeleteTask,
  onEditTask,
  onDragStart,
  onDragOver,
  onDrop,
  // onSelectTask,
}) {
  const [sortedTasks, setSortedTasks] = useState([]);
  const [currentTask, setCurrentTask] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [secondsRemaining, setSecondsRemaining] = useState(null);
  const [timerInterval, setTimerInterval] = useState(null);

  useEffect(() => {
    const sorted = tasks.sort((a, b) => {
      return b.priority - a.priority;
    });
    setSortedTasks(sorted);
  }, [tasks]);

  const handleEditTask = (taskId, updatedTask) => {
    const updatedTasks = sortedTasks.map((task) => {
      if (task.id === taskId) {
        return { ...task, ...updatedTask };
      }
      return task;
    });
    setSortedTasks(updatedTasks);
  };

  const handleDeleteTask = (taskId) => {
    onDeleteTask(taskId);
  };

  const handleDragStart = (ev, id) => {
    onDragStart(ev, id);
  };

  const handleDragOver = (ev) => {
    onDragOver(ev);
  };

  const handleDrop = (ev, index) => {
    onDrop(ev, index);
  };

  const handleCompleteTask = (task) => {
    const updatedTask = { ...task, completed: true };
    onEditTask(updatedTask);
  };

  const handleStartTask = (task) => {
    if (currentTask && currentTask.id === task.id) {
      clearInterval(timerInterval);
      setCurrentTask(null);
      setSecondsRemaining(null);
    } else {
      clearInterval(timerInterval);
      setCurrentTask(task);
      setSecondsRemaining(task.time * 60);
      const intervalId = setInterval(() => {
        setSecondsRemaining((prevSeconds) => prevSeconds - 1);
      }, 1000);
      setTimerInterval(intervalId);
    }
  };

  const handlePauseTask = () => {
    clearInterval(timerInterval);
    setTimerInterval(null);
  };

  const handleStopTask = () => {
    clearInterval(timerInterval);
    setTimerInterval(null);
    setCurrentTask(null);
    setSecondsRemaining(null);
  };

  const handleResetTask = () => {
    setSecondsRemaining(currentTask.time * 60);
    const intervalId = setInterval(() => {
      setSecondsRemaining((prevSeconds) => prevSeconds - 1);
    }, 1000);
    setTimerInterval(intervalId);
  };

  const handleSelectTask = (task) => {
    setSelectedTask(task);
    setCurrentTask(null);
    setSecondsRemaining(null);
  };

  const handleTimerComplete = () => {
    const updatedTask = { ...currentTask, completed: true };
    onEditTask(currentTask.id, updatedTask);
    setCurrentTask(null);
    setSecondsRemaining(null);
  };

  
  return (
    <div>
      <h2>tasks</h2>
      <ul>
        {sortedTasks.map((task, index) => (
          <Task
            key={task.id}
            task={task}
            onDeleteTask={handleDeleteTask}
            onEditTask={handleEditTask}
            onCompleteTask={handleCompleteTask}
            onStartTask={handleStartTask}
            onPauseTask={handlePauseTask}
            onStopTask={handleStopTask}
            onResetTask={handleResetTask}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onSelectTask={handleSelectTask}
            index={index}
            selected={task.id === selectedTask?.id}
            current={task.id === currentTask?.id}
          >
            {currentTask?.id === task.id && (
              <Timer
                duration={currentTask.duration}
                time={secondsRemaining}
                onTimerComplete={handleTimerComplete}
              />
            )}
          </Task>
        ))}
      </ul>
    </div>
  );
}

export default TaskList;
