import { useState } from "react";
import { Link, redirect, useLoaderData } from "react-router-dom";
import WindowHead from "../components/windowHead";
import WindowBody from "../components/windowBody";
import "./css/menu.css";

function changePlayerColor(setColorCallback: (color: string) => void): void {
  const rand_num: number = Math.random() * 16777215;
  const rand_color: string = Math.round(rand_num).toString(16);
  setColorCallback("#" + rand_color);
}

export const loader = async () => {
  const userId = await localStorage.getItem("userId");
  if (!userId) {
    return redirect("/login");
  }

  const userData = localStorage.getItem("userData");

  return {
    userId: userId,
    userData: JSON.parse(userData as string),
  };
};

export default function Menu() {
  //const { user } = useLoaderData<user: {userId: number, userData: { username: string }}>();
  const username: string = "User"; //user.userData.username;
  const [playerColor, setPlayerColor] = useState("#31AFD4");

  return (
    <div className="window-wrapper">
      <WindowHead text={`Welcome back, ${username}!`} />
      <WindowBody id={"menu"}>
        <p>Select your color:</p>
        <div className="color-generation">
          <div
            className="circle-example"
            style={{ backgroundColor: playerColor }}
          ></div>
          <button
            type="button"
            onClick={() => changePlayerColor(setPlayerColor)}
          >
            Generate color
          </button>
        </div>
        <Link to={"/game"}>
          <button type="button" className="play-button">
            Play!
          </button>
        </Link>
      </WindowBody>
    </div>
  );
}
