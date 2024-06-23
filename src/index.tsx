import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Menu, { loader as menuLoader } from "./routes/menu";
import Login, {
  action as loginAction,
  loader as loginLoader,
} from "./routes/login";
import Register, { action as registerAction } from "./routes/register";
import Game from "./game";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Menu />,
        loader: menuLoader,
      },
      {
        path: "login",
        element: <Login />,
        action: loginAction,
        loader: loginLoader,
      },
      {
        path: "register",
        element: <Register />,
        action: registerAction,
      },
    ],
  },
  {
    path: "game",
    element: <Game />,
  },
]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
