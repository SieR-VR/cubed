import { cubedActions } from "../hooks/cubed";
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";

const buttonStyle: React.CSSProperties = {
  width: '50px',
  height: '50px',
  backgroundColor: 'rgba(255, 255, 255, 0.2)',
  border: '2px solid rgba(255, 255, 255, 0.5)',
  borderRadius: '8px',
  color: 'white',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  touchAction: 'none',
  WebkitTouchCallout: 'none',
  WebkitUserSelect: 'none',
};

const iconStyle: React.CSSProperties = {
  width: '32px',
  height: '32px',
  strokeWidth: 3,
};

const containerStyle: React.CSSProperties = {
  position: 'absolute',
  left: '20px',
  bottom: '20px',
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 50px)',
  gridTemplateRows: 'repeat(3, 50px)',
  gap: '5px',
};

export function DirectionPad() {
  const handleClick = (direction: "up" | "down" | "left" | "right") => {
    cubedActions.rotate(direction);
  };

  return (
    <div style={containerStyle}>
      <div /> {/* empty cell */}
      <button
        style={buttonStyle}
        onClick={() => handleClick("up")}
      >
        <ArrowUp style={iconStyle} />
      </button>
      <div /> {/* empty cell */}
      <button
        style={buttonStyle}
        onClick={() => handleClick("left")}
      >
        <ArrowLeft style={iconStyle} />
      </button>
      <div /> {/* empty cell */}
      <button
        style={buttonStyle}
        onClick={() => handleClick("right")}
      >
        <ArrowRight style={iconStyle} />
      </button>
      <div /> {/* empty cell */}
      <button
        style={buttonStyle}
        onClick={() => handleClick("down")}
      >
        <ArrowDown style={iconStyle} />
      </button>
      <div /> {/* empty cell */}
    </div>
  );
}
