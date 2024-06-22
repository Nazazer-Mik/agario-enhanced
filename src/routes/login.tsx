import { Form, Link } from "react-router-dom";
import WindowHead from "../components/windowHead";
import WindowBody from "../components/windowBody";
import "./css/auth.css";

export default function Login() {
  return (
    <div className="window-wrapper">
      <WindowHead text="LOGIN" />
      <WindowBody id={"login-window-body"}>
        <Form className="auth-form" id="login">
          <div className="center-container">
            <div>
              <label htmlFor="username">Username:</label>
              <input type="text" placeholder="Alex001" id="username" />
            </div>
            <div>
              <label htmlFor="password"> Password:</label>
              <input type="password" id="password" placeholder="12345678" />
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
