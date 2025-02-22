import { Title } from "./title";
import { Cubed } from "./cubed";
import { useCubedState } from "../hooks/cubed";

export function App() {
  const { scene } = useCubedState();

  return (
    <>
      {scene === "title" && <Title />}
      {scene === "game" && <Cubed />}
    </>
  );
}
