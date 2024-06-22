import { Form, Link } from "react-router-dom";
import WindowHead from "../components/windowHead";
import WindowBody from "../components/windowBody";
import "./css/auth.css";

export default function Register() {
  return (
    <div className="window-wrapper">
      <WindowHead text="REGISTER" />
      <WindowBody id={"reg-window-body"}>
        <Form className="auth-form" id="register">
          <div className="center-container">
            <div>
              <label htmlFor="email">Username:</label>
              <input type="text" placeholder="example000@mail.com" id="email" />
            </div>
            <div>
              <label htmlFor="username">Username:</label>
              <input type="text" placeholder="Alex001" id="username" />
            </div>
            <div>
              <label htmlFor="password"> Password:</label>
              <input type="password" id="password" placeholder="12345678" />
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
