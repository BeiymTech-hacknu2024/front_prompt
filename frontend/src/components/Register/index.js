import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { dataUserRegister } from "../../Contexts/Services";
import BackgroundTreeLayout from "../BackgroundTreeLayout";
import "./styles.css";

export default function Register() {
  const navigate = useNavigate();
  const [username, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const [passwordType, setPasswordType] = useState("password");
  const [passwordTypeAgain, setPasswordTypeAgain] = useState("password");
  const [errMes, setErrMes] = useState("");

  const [clicked, setClicked] = useState(false);
  const handlOnClickReq = () => {
    setClicked(true);
    if (password !== passwordAgain) {
      setClicked(false);
      return setErrMes(
        "The passwords differ. Please enter the same password again."
      );
    }
    dataUserRegister(username, email, password).then((res) => {
      if (res.status) {
        setEmail("");
        setName("");
        setPassword("");
        navigate("/");
      } else {
        setErrMes(res.message);
        setClicked(false);
      }
    });
  };

  return (
    <div className="RegisterWrapper">
      <div className="Register">
        <div className="RegisterForm">
          <div className="RegisterTitle">
            <h3>Register</h3>
          </div>
          <div className="RegisterGrid">
            <div className="RegisterName">
              <input
                placeholder="Username"
                value={username}
                onChange={(e) => setName(e.target.value)}
              ></input>
            </div>
            <div className="RegisterEmail">
              <input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></input>
            </div>
            <div className="RegisterPassword">
              <input
                type={passwordType}
                name="password"
                autocomplete="current-password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="RegisterPassword">
              <input
                type={passwordTypeAgain}
                name="password"
                autocomplete="current-password"
                placeholder="Password Again"
                value={passwordAgain}
                onChange={(e) => setPasswordAgain(e.target.value)}
              />
            </div>
            {errMes !== "" && (
              <div className="divErrorMessage">
                {" "}
                <p className="ErrorMessage">{errMes}</p>{" "}
              </div>
            )}
            <div
              className="submitRegisterButton"
              style={{
                opacity: clicked ? "75%" : "100%",
                pointerEvents: clicked ? "none" : "auto",
              }}
            >
              <button onClick={handlOnClickReq}>Register</button>
            </div>
          </div>
          <div className="loginButton">
            <button onClick={() => navigate("/login")}>Log In</button>
          </div>
        </div>
      </div>
    </div>
  );
}
