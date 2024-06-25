import { ReactNode, useEffect, useState } from "react";
import "./game.css";
import { render, setup } from "./gameLogic";
import Player from "./game_components/player";
import { NavigateFunction, useNavigate } from "react-router-dom";

function gameOver(navigate: NavigateFunction): void {
  navigate("/");
  window.location.reload();
}

function getLeaders(leaders: Player[]): ReactNode[] {
  let lines: ReactNode[] = [];

  for (let i = 1; i < 11; i++) {
    lines.push(
      <div key={leaders[i - 1]?.userName}>
        {i + "."}&nbsp;&nbsp;&nbsp;{leaders[i - 1]?.userName || " "}
      </div>
    );
  }
  leaders.forEach((player) => {});

  return lines;
}

function startGame(
  setLeaders: (leaders: Player[]) => void,
  navigate: NavigateFunction
) {
  const canvas: HTMLCanvasElement = document.getElementById(
    "viewport"
  ) as HTMLCanvasElement;
  const mass: HTMLDivElement = document.getElementById(
    "current-mass"
  ) as HTMLDivElement;

  setup(
    canvas,
    mass,
    (leaders: Player[]) => setLeaders(leaders),
    () => gameOver(navigate)
  );
  window.requestAnimationFrame(render);
}

export default function Game() {
  const [leaders, setLeaders] = useState<Player[]>([]);
  useEffect(() => startGame(setLeaders, navigate), []);
  const navigate = useNavigate();

  return (
    <>
      <canvas id="viewport" />
      <h3 id="current-mass">Current mass: </h3>
      <div className="leaderboard">
        <div>
          <center>Leaderboard</center>
        </div>
        {getLeaders(leaders)}
      </div>
    </>
  );
}
