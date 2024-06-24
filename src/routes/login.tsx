import { Form, Link, redirect } from "react-router-dom";
import WindowHead from "../components/windowHead";
import WindowBody from "../components/windowBody";
import "./css/auth.css";
import { CheckLoginCredentials } from "./authUtils";
import { md5 } from "js-md5";

export const loader = async () => {
  const userId: string | null = localStorage.getItem("userId");
  if (userId != null) {
    return redirect("/");
  }

  return null;
};

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  let loginData = await Object.fromEntries(formData);

  // Line where errors are showed
  let errLine: HTMLElement = document.getElementById(
    "error-line"
  ) as HTMLElement;

  // Check credentials for validity
  const status: string = CheckLoginCredentials(loginData);
  if (status !== "OK") {
    errLine.innerHTML = status;
    return null;
  }

  // Encrypt password
  loginData.password = await md5(loginData.password as string);

  // Send login request
  await fetch("http://localhost:8800/login", {
    method: "POST",
    body: JSON.stringify(loginData),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((response) => response.text())
    .then((message) => {
      const loginInfo = JSON.parse(message);
      if (loginInfo.status === "OK") {
        errLine.innerHTML = "";
        localStorage.setItem("userId", loginInfo.userId);
        localStorage.setItem("username", loginData.username as string);
      } else {
        errLine.innerHTML = loginInfo.status;
      }
    })
    .catch((err) => {
      console.log(err.message);
    });

  return errLine.innerHTML === "" ? redirect("/") : null;
}

export default function Login() {
  return (
    <div className="window-wrapper">
      <WindowHead text="LOGIN" />
      <WindowBody id={"login-window-body"}>
        <Form className="auth-form" id="login" method="post">
          <div className="center-container">
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
                Don't have an account yet? <Link to={"/register"}>Sign up</Link>
              </p>
            </div>
            <button type="submit">Submit</button>
          </div>
        </Form>
      </WindowBody>
    </div>
  );
}
