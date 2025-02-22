import { cubedActions } from "../hooks/cubed";
import icon from "/icon.png?url";

export function Title() {
  return (
    <div style={{
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",

      color: "white",
      fontSize: "2rem",
      fontWeight: "bold",
      textAlign: "center",

    }}>
      <h1 style={{
        textShadow: "0 0 10px #fff",
      }}>Cubed</h1>
      <div onClick={() => cubedActions.initGameState(6)} style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1rem",
        width: "24rem",
        height: "24rem",
      }}>
        <img
          src={icon}
          alt="Play"
          style={{
            width: "24rem",
            height: "24rem",
            cursor: "pointer",
            position: "absolute",
            margin: "auto",
          }}
        />
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: "4rem",
          fontWeight: "bold",
          textAlign: "center",
          color: "white",
        }}>
          Play
        </div>
      </div>
    </div>
  );
}
