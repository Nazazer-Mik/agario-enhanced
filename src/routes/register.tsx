import { Form, Link, redirect, useNavigate } from "react-router-dom";
import WindowHead from "../components/windowHead";
import WindowBody from "../components/windowBody";
import "./css/auth.css";
import { md5 } from "js-md5";
import { CheckRegisterCredentials } from "./authUtils";
import { useEffect, useState } from "react";

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  let regData = await Object.fromEntries(formData);

  // Line where errors are showed
  let errLine: HTMLElement = document.getElementById(
    "error-line"
  ) as HTMLElement;

  // Check credentials for complexity
  const status: string = CheckRegisterCredentials(regData);
  if (status !== "OK") {
    errLine.innerHTML = status;
    return null;
  }

  // Encrypt password
  regData.password = await md5(regData.password as string);

  // Send register request
  await fetch("http://localhost:8800/register", {
    method: "POST",
    body: JSON.stringify(regData),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((response) => response.text())
    .then((message) => {
      if (message === "OK") {
        errLine.innerHTML = "";
      } else {
        errLine.innerHTML = message;
      }
    })
    .catch((err) => {
      console.log(err.message);
    });

  return errLine.innerHTML === "" ? redirect("/login") : null;
}

export default function Register() {
  useEffect(() => {
    setTimeout(() => setAnimate(false), 5);
    setTimeout(() => setAnimate(true), 5);
  }, []);
  const [animate, setAnimate] = useState(false);
  const navigate = useNavigate();

  const startLoginTransition = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setAnimate(false);
    setTimeout(() => navigate("/login"), 500);
  };

  return (
    <div className={`window-wrapper ${animate ? "" : "behind-screen"}`}>
      <WindowHead text="REGISTER" />
      <WindowBody id={"reg-window-body"}>
        <Form className="auth-form" id="register" method="post">
          <div className="center-container">
            <div>
              <label htmlFor="email">Email:</label>
              <input
                type="text"
                placeholder="example000@mail.com"
                id="email"
                name="email"
              />
            </div>
            <div>
              <label htmlFor="username">Username:</label>
              <input
                type="text"
                placeholder="Alex001"
                id="username"
                name="username"
              />
            </div>
            <div>
              <label htmlFor="password"> Password:</label>
              <input
                type="password"
                id="password"
                placeholder="StrongSquirrel"
                name="password"
              />
              <h5 id="error-line"></h5>
              <p>
                Already have an account?{" "}
                <a href={"/login"} onClick={startLoginTransition}>
                  Log in
                </a>
              </p>
            </div>
            <button type="submit">Submit</button>
          </div>
        </Form>
      </WindowBody>
    </div>
  );
}
