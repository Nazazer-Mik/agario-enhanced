import { ReactNode, useEffect } from "react";
import "./game.css";
import { render, setup } from "./gameLogic";

function getLeaders(): ReactNode {
  let lines: ReactNode[] = [];
  let username = "";
  for (let i = 1; i < 11; i++) {
    lines.push(
      <div>
        {i}.{" " + username}
      </div>
    );
  }

  return lines;
}

function startGame() {
  const canvas: HTMLCanvasElement = document.getElementById(
    "viewport"
  ) as HTMLCanvasElement;
  const mass: HTMLDivElement = document.getElementById(
    "current-mass"
  ) as HTMLDivElement;

  setup(canvas, mass);
  window.requestAnimationFrame(render);
}

export default function Game() {
  useEffect(() => startGame(), []);

  return (
    <>
      <canvas id="viewport" />
      <h3 id="current-mass">Current mass: </h3>
      <div className="leaderboard">{getLeaders()}</div>
    </>
  );
}
