import React, { useState, useEffect } from "react";
import Timer from "./Timer";

function Task({
  task,
  onEditTask,
  onDeleteTask,
  onDragStart,
  onDragOver,
  onDrop,
  // onCompleteTask,
  index,
  // onSelectTask,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedTask, setUpdatedTask] = useState(task);
  const [isStarted, setIsStarted] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(task.elapsedTime || 0);
  const [timerInterval, setTimerInterval] = useState(null);
  const [completed, setCompleted] = useState(task.completed || false);
  const [completedTasks, setCompletedTasks] = useState([]);


  useEffect(() => {
    setUpdatedTask(task);
  }, [task]);

  useEffect(() => {
    if (isStarted) {
      setStartTime(Date.now() - elapsedTime);
      setTimerInterval(
        setInterval(() => {
          setElapsedTime(Date.now() - startTime);
        }, 1000)
      );
    } else {
      clearInterval(timerInterval);
    }

    return () => {
      clearInterval(timerInterval);
    };
  }, [isStarted]);

  useEffect(() => {
    setUpdatedTask({ ...updatedTask, elapsedTime });
  }, [elapsedTime]);

  const handleDragStart = (ev, id) => {
    onDragStart(ev, id);
  };

  const handleDragOver = (ev) => {
    onDragOver(ev);
  };

  const handleDrop = (ev, index) => {
    onDrop(ev, index);
  };

  const handleDescriptionChange = (event) => {
    setUpdatedTask({ ...updatedTask, description: event.target.value });
  };

  const handleDurationChange = (event) => {
    setUpdatedTask({ ...updatedTask, duration: event.target.value });
  };

  const handlePriorityChange = (event) => {
    setUpdatedTask({ ...updatedTask, priority: event.target.value });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setUpdatedTask(task);
  };

  const handleSave = () => {
    console.log("currentTask:", task);
    console.log("currentTask:", updatedTask);
    onEditTask(task.id, updatedTask);
    setIsEditing(false);
  };

  const handleDelete = () => {
    onDeleteTask(task.id);
  };

  const handleStart = () => {
    setIsStarted(true);
  };

  function handleTaskCompletion(task) {
    task.completed = true;
    setCompletedTasks([...completedTasks, task]);
  }

  return (
    <div
      className={`task ${isStarted ? "started" : ""} ${completed ? "completed" : ""}`}
      draggable="true"
      onDragStart={(e) => handleDragStart(e, task.id)}
      onDragOver={handleDragOver}
      onDrop={(e) => handleDrop(e, index)}
    >
      {isEditing ? (
        <div className="task-edit">
          <div className="task-edit-inputs">
            <label htmlFor="description-input">Description:</label>
            <input
              type="text"
              id="description-input"
              value={updatedTask.description}
              onChange={handleDescriptionChange}
            />
            <label htmlFor="duration-input">Duration:</label>
            <input
              type="text"
              id="duration-input"
              value={updatedTask.duration}
              onChange={handleDurationChange}
            />
            <label htmlFor="priority-select">Priority:</label>
            <select
              id="priority-select"
              value={updatedTask.priority}
              onChange={handlePriorityChange}
            >
              <option value="">Select Priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <div className="task-edit-actions">
            <button onClick={handleCancelEdit}>Cancel</button>
            <button onClick={handleSave}>Save</button>
          </div>
        </div>
      ) : (
        <div className="task-details">
          <div className="task-info">
            <div className="task-description">Description task: <br/> {task.description}</div>
            <div className="task-duration">Duration: {task.duration}</div>
            <div className="task-duration">Priority: {task.priority}</div>
          </div>
          <div className="task-actions">
          {!completed && <>
            <button onClick={handleEdit}>Edit</button>
            <button onClick={handleDelete}>Delete</button>
          </>}
            {!completed && <button onClick={() => {
                handleTaskCompletion(task);
                setCompleted(true);
            }}>Completada</button>}
            {task.status === "not-started" ? (
              <button onClick={handleStart}>Comenzar</button>
            ) : (
              ""
            )}
          </div>
        </div>
      )}
      {!completed && <Timer duration={task.duration} htmlFor="description-input">Description:</Timer>}
    </div>
  );
}

export default Task;
