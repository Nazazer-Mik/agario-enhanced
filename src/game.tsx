import { ReactNode, useEffect } from "react";
import "./game.css";
import { draw, setup, update } from "./gameLogic";

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

// Limiting to 60fps
let lastFrameTime = performance.now();
const targetFrameTime = 1000 / 60;

function render(): void {
  const now = performance.now();
  const delta = now - lastFrameTime;
  let gameOver = false;

  if (delta >= targetFrameTime) {
    lastFrameTime = now - (delta % targetFrameTime);

    gameOver = update();
    draw();
  }

  if (!gameOver) {
    window.requestAnimationFrame(render);
  }
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
      <h3 id="current-mass"></h3>
      <div className="leaderboard">{getLeaders()}</div>
    </>
  );
}
