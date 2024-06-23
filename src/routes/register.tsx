import { Form, Link, redirect } from "react-router-dom";
import WindowHead from "../components/windowHead";
import WindowBody from "../components/windowBody";
import "./css/auth.css";

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const regData = await Object.fromEntries(formData);
  await console.log(JSON.stringify(regData));
  await fetch("http://localhost:8800/register", {
    method: "POST",
    body: JSON.stringify(regData),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((response) => console.log(response.status))
    .catch((err) => {
      console.log(err.message);
    });
  //return redirect("/login");
  return null;
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
