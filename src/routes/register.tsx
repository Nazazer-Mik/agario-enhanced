import { Form, Link, redirect } from "react-router-dom";
import WindowHead from "../components/windowHead";
import WindowBody from "../components/windowBody";
import "./css/auth.css";
import { md5 } from "js-md5";

function CheckCredentials(user: { [k: string]: FormDataEntryValue }): string {
  const emailRegexp =
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  const email = (user.email as string).toLowerCase();

  const passwordRegexp = /^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
  const password = (user.password as string).toLowerCase();

  const usernameRegexp = /^.{3,16}$/;
  const username = (user.username as string).toLowerCase();

  if (email == "" || username == "" || password == "")
    return "Please, fill all the fields";

  if (!email.match(emailRegexp))
    return "The entered email address is not valid";

  if (!username.match(usernameRegexp))
    return "Username is too short or too long";

  if (!password.match(passwordRegexp))
    return "Password doesn't meet complexity requirements";

  return "OK";
}

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  let regData = await Object.fromEntries(formData);

  // Line where errors are showed
  let errLine: HTMLElement = document.getElementById(
    "error-line"
  ) as HTMLElement;

  // Check credentials for complexity
  const status: string = CheckCredentials(regData);
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
      if (message == "OK") {
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
  return (
    <div className="window-wrapper">
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
                placeholder="12345678"
                name="password"
              />
              <h5 id="error-line"></h5>
              <p>
                Already have an account? <Link to={"/login"}>Log in</Link>
              </p>
            </div>
            <button type="submit">Submit</button>
          </div>
        </Form>
      </WindowBody>
    </div>
  );
}
