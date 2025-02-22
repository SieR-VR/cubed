import { Home, RotateCcw } from "lucide-react";
import { cubedActions, useCubedState } from "../hooks/cubed";

export function Result() {
  const { score, size } = useCubedState();

  return (
    <div
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",

        width: "32rem",
        height: "18rem",

        color: "white",
        fontSize: "2rem",
        fontWeight: "bold",
        textShadow: "0 0 10px white",

        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",

        backgroundColor: "rgba(0, 0, 0, 0.5)",
        padding: "1rem",
        borderRadius: "0.5rem",
        boxShadow: "0 0 10px white",
      }}
    >
      <div>{`${size}x${size}x${size}`}</div>
      <div>Score: {score}</div>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: "1rem",

          marginTop: "1rem",
        }}
      >
        <RotateCcw
          onClick={() => {
            cubedActions.initGameState(size);
          }}
          size={"3rem"}
          style={{
            cursor: "pointer",
          }}
        />

        <Home
          onClick={() => {
            cubedActions.goTitle();
          }}
          size={"3rem"}
          style={{
            cursor: "pointer",
          }}
        />
      </div>
    </div>
  );
}
