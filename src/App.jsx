import React from "react";
import { useEffect, useState } from "react";
import { interval, Subject, fromEvent } from "rxjs";
import { takeUntil, map, buffer, debounceTime, filter } from "rxjs/operators";

import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import "./App.css";

function App() {
  const [sec, setSec] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const wait = React.useCallback(() => {
    setIsRunning(false);
  }, []);

  useEffect(() => {
    const unsubscribe$ = new Subject();
    interval(1000)
      .pipe(takeUntil(unsubscribe$))
      .subscribe(() => {
        if (isRunning === true) {
          setSec((val) => val + 1000);
        }
      });

    const click$ = fromEvent(document.querySelector(".wait-button"), "click");
    const buff$ = click$.pipe(debounceTime(300));

    const doubleClick$ = click$.pipe(
      buffer(buff$),
      map((list) => list.length),
      filter((x) => x === 2)
    );

    doubleClick$.subscribe(() => wait());

    return () => {
      unsubscribe$.next();
      unsubscribe$.complete();
    };
  }, [isRunning, wait]);

  const start = React.useCallback(() => {
    setIsRunning(true);
  }, []);
  const stop = React.useCallback(() => {
    setIsRunning(false);
    setSec(0);
  }, []);

  const reset = React.useCallback(() => {
    setSec(0);
  }, []);

  return (
    <div className="timer">
      <span className="timer-numbers"> {new Date(sec).toISOString().slice(11, 19)}</span>
      <ButtonGroup size="large" color="primary" aria-label="large outlined primary button group">
        <Button onClick={isRunning ? stop : start}> {isRunning ? 'Stop' : 'Start'}</Button>
        <Button onClick={reset}>Reset</Button>
        <Button className="wait-button">Wait</Button>
      </ButtonGroup>
    </div>
  );
}

export default App;
