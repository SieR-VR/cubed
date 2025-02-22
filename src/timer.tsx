import { useEffect, useRef } from "react";
import { cubedActions, useCubedState } from "../hooks/cubed";

export function Timer() {
  const { start, timeLimit, end } = useCubedState();

  const divRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const time = new Date().getTime() - start.getTime();

      if (divRef.current) {
        divRef.current.textContent = `${(time / 1000).toFixed(1)}`;
      }

      if (progressRef.current) {
        progressRef.current.style.height = `${(
          (time / 1000 / timeLimit) *
          100
        ).toFixed(2)}%`;
      }

      if (time >= timeLimit * 1000) {
        cubedActions.endGame();
        clearInterval(interval);

        if (progressRef.current) {
          progressRef.current.style.height = `99%`;
        }

        if (divRef.current) {
          divRef.current.textContent = `${timeLimit}`;
        }
      }
    }, 16);

    return () => clearInterval(interval);
  }, [end]);

  return (
    <div
      style={{
        position: "absolute",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        top: "50%",
        right: "2.5rem",
        transform: "translateY(-50%)",
      }}
    >
      <div
        style={{
          color: "white",
          fontSize: "2rem",
          fontWeight: "bold",
          textShadow: "0 0 10px white",
          marginBottom: "1rem",
        }}
        ref={divRef}
      />
      <div
        style={{
          height: "66vh",
          width: "1.5rem",
          backgroundColor: "white",

          borderRadius: "0.75rem",
          boxShadow: "0 0 10px white",

          display: "flex",
          alignItems: "start",
          justifyContent: "center",
        }}
      >
        <div
          ref={progressRef}
          style={{
            width: "80%",
            marginTop: "0.25rem",
            marginBottom: "0.25rem",
            backgroundColor: "black",

            borderRadius: "0.75rem",
          }}
        />
      </div>
    </div>
  );
}
