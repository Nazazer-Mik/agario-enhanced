import { useEffect, useState } from "react";
import {
  Link,
  NavigateFunction,
  redirect,
  useLoaderData,
  useNavigate,
} from "react-router-dom";
import WindowHead from "../components/windowHead";
import WindowBody from "../components/windowBody";
import "./css/menu.css";

function changePlayerColor(setColorCallback: (color: string) => void): void {
  const rand_num: number = Math.random() * 16777215;
  const rand_color: string = Math.round(rand_num).toString(16);
  setColorCallback("#" + rand_color);
}

function Logout(navigate: NavigateFunction) {
  localStorage.removeItem("userId");
  localStorage.removeItem("username");
  localStorage.removeItem("playerColor");
  navigate("/login");
}

export const loader = async () => {
  const userId = await localStorage.getItem("userId");
  const username = localStorage.getItem("username");

  const userInfo = {
    id: userId,
    name: username,
  };

  if (!userId) {
    return redirect("/login");
  }

  return userInfo;
};

export default function Menu() {
  const user = useLoaderData() as { id: string; name: string };
  const [playerColor, setPlayerColor] = useState("#31AFD4");
  const navigate = useNavigate(); // For logout redirect

  useEffect(() => {
    localStorage.setItem("playerColor", playerColor);

    setTimeout(() => {
      document
        .getElementsByClassName("window-wrapper")[0]
        .classList.remove("behind-screen");
    }, 5);
  }, [playerColor]);

  const startGameTransition = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    document.getElementsByClassName("App")[0].classList.add("blur");
    setTimeout(() => navigate("/game"), 1000);
  };

  return (
    <>
      <div className="window-wrapper behind-screen">
        <WindowHead text={`Welcome back, ${user.name}!`} />
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
          <a href={"/game"} onClick={startGameTransition}>
            <button type="button" className="play-button">
              Play!
            </button>
          </a>
        </WindowBody>
      </div>
      <button type="button" id="logout" onClick={() => Logout(navigate)}>
        Logout
      </button>
    </>
  );
}
