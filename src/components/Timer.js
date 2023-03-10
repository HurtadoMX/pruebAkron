import React, { useState, useEffect, useRef } from "react";

const Timer = ({ duration, onTimerStop }) => {
  const [remainingTime, setRemainingTime] = useState(duration * 60); // aquí se multiplica por 60
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setRemainingTime((prevRemainingTime) => prevRemainingTime - 1);
      }, 1000);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  const handleStartClick = () => {
    setIsRunning(true);
  };

  const handlePauseClick = () => {
    setIsRunning(false);
  };

  const handleStopClick = () => {
    setIsRunning(false);
    setRemainingTime(duration * 60); // aquí también se multiplica por 60
    onTimerStop();
  };

  const handleRestartClick = () => {
    setIsRunning(false);
    setRemainingTime(duration * 60); // aquí también se multiplica por 60
  };

  useEffect(() => {
    if (remainingTime <= 0) {
      setIsRunning(false);
      onTimerStop();
    }
  }, [remainingTime]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60) // aquí se divide por 60
      .toString()
      .padStart(2, "0");
    const seconds = (time % 60).toString().padStart(2, "0");

    return `${minutes}:${seconds}`;
  };

  return (
    <div className="timer">
      <div className="timer-controls">
        {isRunning ? (
          <button onClick={handlePauseClick}>Pause</button>
        ) : (
          <button onClick={handleStartClick}>Start</button>
        )}
        <button onClick={handleStopClick}>Stop</button>
        <button onClick={handleRestartClick}>Restart</button>
      </div>
      <div className="timer-display">{formatTime(remainingTime)}</div>
    </div>
  );
};

export default Timer;