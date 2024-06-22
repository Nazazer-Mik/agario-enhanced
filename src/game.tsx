import { ReactNode } from "react";
import "./game.css";

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

export default function Game() {
  return (
    <>
      <canvas id="viewport" />
      <h3 className="current-mass">Current mass: {513}</h3>
      <div className="leaderboard">{getLeaders()}</div>
    </>
  );
}
