import React, { useState, useEffect } from "react";

function TaskForm(props) {
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [priority, setPriority] = useState("low");
  const [selectedTaskIndex, setSelectedTaskIndex] = useState(-1);
  const [timerActive, setTimerActive] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [timeElapsed, setTimeElapsed] = useState(0);

  useEffect(() => {
    if (selectedTaskIndex !== -1) {
      const selectedTask = props.tasks[selectedTaskIndex];
      setDescription(selectedTask.description);
      setDuration(selectedTask.duration);
      setPriority(selectedTask.priority);
      setTimerActive(false);
      setStartTime(null);
      setTimeElapsed(0);
    } else {
      setDescription("");
      setDuration("");
      setPriority("low");
      setTimerActive(false);
      setStartTime(null);
      setTimeElapsed(0);
    }
  }, [selectedTaskIndex, props.tasks]);

  useEffect(() => {
    let intervalId;
    if (timerActive) {
      intervalId = setInterval(() => {
        setTimeElapsed(Date.now() - startTime);
      }, 1000);
    }
    return () => {
      clearInterval(intervalId);
    };
  }, [timerActive, startTime]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!description.trim() || !duration.toString().trim() || !priority.trim())
      return;
    const updatedTask = { description, duration, priority };
    if (selectedTaskIndex !== -1) {
      props.onEditTask(props.tasks[selectedTaskIndex].id, updatedTask);
      setSelectedTaskIndex(-1);
    } else {
      props.onAddTask(updatedTask);
    }
    setDescription("");
    setDuration("");
    setPriority("low");
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleDurationChange = (event) => {
    const durationValue = parseInt(event.target.value, 10);
    setDuration(durationValue);
  };

  const handlePriorityChange = (event) => {
    setPriority(event.target.value);
  };

  const handleTaskSelection = (index) => {
    setSelectedTaskIndex(index);
  };

  const handleStartTask = () => {
    const selectedTask = props.tasks[selectedTaskIndex];
    setStartTime(Date.now());
    setTimerActive(true);
    console.log("Starting timer for task:", selectedTask);
  };


  return (
    <form onSubmit={handleSubmit} className="task-form">
      <label>
        Description:
        <input
          type="text"
          value={description}
          onChange={handleDescriptionChange}
          className="task-form__input"
        />
      </label>
      <label>
        Duration:
        <input
          type="number"
          value={duration}
          onChange={handleDurationChange}
          className="task-form__input"
        />
      </label>
      <label>
        Priority:
        <select value={priority} onChange={handlePriorityChange} className="task-form__select">
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </label>
      {props.tasks && props.tasks.length > 0 && (
        <div>
          <label>Select a task to start:</label>
          <ul className="task-form__list">
            {props.tasks.map((task, index) => (
              <li
                key={task.id}
                onClick={() => handleTaskSelection(index)}
                className={`task-form__list-item ${selectedTaskIndex === index ? "selected" : ""}`}
              >
                {task.description}
              </li>
            ))}
          </ul>
        </div>
      )}
      {selectedTaskIndex !== -1 && (
        <button type="button" onClick={handleStartTask} className="task-form__button">
          Start Task
        </button>
      )}
      {selectedTaskIndex !== -1 && (
        <button
          type="button"
          onClick={() => props.onDeleteTask(props.tasks[selectedTaskIndex].id)}
          className="task-form__button"
        >
          Delete Task
        </button>
      )}
      <button type="submit" className="task-form__submit">
        {selectedTaskIndex !== -1 ? "Save Task" : "Add Task"}
      </button>
    </form>
  );
}

export default TaskForm;
