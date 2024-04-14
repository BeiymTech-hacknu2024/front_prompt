import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { dataUserLogin } from "../../Contexts/Services";
import BackgroundTreeLayout from "../BackgroundTreeLayout";

// import "./new.css";
import "./styles.css";

export default function LogIn() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordType, setPasswordType] = useState("password");
  const eye_path =
    passwordType === "password" ? (
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M6.03872 15.428C4.57904 14.1738 3.53645 12.7403 3.04734 11.9999C3.53645 11.2595 4.57904 9.82602 6.03872 8.5719C7.54575 7.27711 9.40657 6.24992 11.4998 6.24992C13.5931 6.24992 15.454 7.27711 16.961 8.5719C18.4207 9.82602 19.4633 11.2595 19.9524 11.9999C19.4633 12.7403 18.4207 14.1738 16.961 15.428C15.454 16.7228 13.5931 17.7499 11.4998 17.7499C9.40657 17.7499 7.54575 16.7228 6.03872 15.428ZM11.4998 4.33325C8.76621 4.33325 6.47544 5.66976 4.78968 7.11812C3.0978 8.57173 1.92374 10.2151 1.40269 11.0126C1.009 11.6151 1.009 12.3847 1.40269 12.9872C1.92374 13.7847 3.0978 15.4281 4.78968 16.8818C6.47544 18.3301 8.76621 19.6666 11.4998 19.6666C14.2335 19.6666 16.5243 18.3301 18.2101 16.8818C19.9019 15.4281 21.076 13.7847 21.597 12.9872C21.9907 12.3847 21.9907 11.6151 21.597 11.0126C21.076 10.2151 19.9019 8.57173 18.2101 7.11812C16.5243 5.66976 14.2335 4.33325 11.4998 4.33325ZM9.58315 11.9999C9.58315 10.9413 10.4413 10.0833 11.4998 10.0833C12.5584 10.0833 13.4165 10.9413 13.4165 11.9999C13.4165 13.0585 12.5584 13.9166 11.4998 13.9166C10.4413 13.9166 9.58315 13.0585 9.58315 11.9999ZM11.4998 8.16659C9.38276 8.16659 7.66652 9.88283 7.66652 11.9999C7.66652 14.117 9.38276 15.8333 11.4998 15.8333C13.617 15.8333 15.3331 14.117 15.3331 11.9999C15.3331 9.88283 13.617 8.16659 11.4998 8.16659Z"
        fill="black"
      />
    ) : (
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M18.886 5.46935C19.2603 5.0951 19.2603 4.48832 18.886 4.11406C18.5118 3.73981 17.905 3.73981 17.5308 4.11406L13.4474 8.19745C12.8767 7.86022 12.211 7.66671 11.5001 7.66671C9.38297 7.66671 7.66673 9.38295 7.66673 11.5C7.66673 12.2109 7.86024 12.8767 8.19747 13.4474L4.11408 17.5307C3.73983 17.905 3.73983 18.5118 4.11408 18.886C4.48834 19.2602 5.09512 19.2602 5.46937 18.886L9.55275 14.8026C10.1234 15.1399 10.7892 15.3334 11.5001 15.3334C13.6171 15.3334 15.3334 13.6171 15.3334 11.5C15.3334 10.7891 15.1399 10.1234 14.8027 9.55274L18.886 5.46935ZM11.9965 9.64825C11.8382 9.60599 11.6718 9.58337 11.5001 9.58337C10.4415 9.58337 9.58339 10.4415 9.58339 11.5C9.58339 11.6718 9.60601 11.8381 9.64827 11.9965L11.9965 9.64825ZM11.0036 13.3518L13.3518 11.0036C13.3941 11.1619 13.4167 11.3283 13.4167 11.5C13.4167 12.5586 12.5586 13.4167 11.5001 13.4167C11.3283 13.4167 11.162 13.3941 11.0036 13.3518ZM15.1083 4.61988C14.0192 4.14051 12.8106 3.83337 11.5001 3.83337C8.76645 3.83337 6.47568 5.16988 4.78992 6.61824C3.09804 8.07185 1.92398 9.71524 1.40294 10.5128C1.00924 11.1153 1.00924 11.8848 1.40294 12.4873C1.84271 13.1604 2.74766 14.4361 4.0365 15.6917L5.39189 14.3363C4.26991 13.247 3.46102 12.1259 3.04758 11.5C3.53669 10.7596 4.57928 9.32614 6.03897 8.07203C7.546 6.77723 9.40681 5.75004 11.5001 5.75004C12.2398 5.75004 12.9505 5.87831 13.6269 6.10135L15.1083 4.61988ZM11.5001 17.25C10.7604 17.25 10.0497 17.1217 9.37336 16.8987L7.8919 18.3802C8.98095 18.8596 10.1896 19.1667 11.5001 19.1667C14.2337 19.1667 16.5245 17.8302 18.2103 16.3819C19.9022 14.9282 21.0762 13.2848 21.5973 12.4873C21.9909 11.8848 21.9909 11.1153 21.5973 10.5128C21.1575 9.83963 20.2525 8.56397 18.9637 7.3084L17.6083 8.66379C18.7303 9.75309 19.5392 10.8742 19.9527 11.5C19.4635 12.2404 18.421 13.6739 16.9612 14.9281C15.4542 16.2229 13.5933 17.25 11.5001 17.25Z"
        fill="black"
      />
    );
  const [errMes, setErrMes] = useState("");

  const [clicked, setClicked] = useState(false);
  const handlOnClickReq = () => {
    setClicked(true);
    dataUserLogin(email, password).then((res) => {
      if (res.status) navigate("/");
      else {
        setErrMes(res.message);
        setClicked(false);
      }
    });
  };

  return (
    <div className="LoginWrapper">
      <div className="LogIn">
        <div className="LogInForm">
          <div className="LogInTitle">
            <h3>Login</h3>
          </div>
          <div className="LogInGrid">
            <div className="LogInEmail">
              <input
                type="email"
                name="email"
                autocomplete="email"
                placeholder="Write email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></input>
            </div>
            <div className="LogInPassword">
              <input
                type={passwordType}
                name="password"
                autocomplete="current-password"
                placeholder="Write Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {errMes !== "" && (
              <div className="divErrorMessage">
                {" "}
                <p className="ErrorMessage">{errMes}</p>{" "}
              </div>
            )}
            <div
              className="submitLogInButton"
              style={{
                opacity: clicked ? "75%" : "",
                pointerEvents: clicked ? "none" : "",
              }}
            >
              <button onClick={handlOnClickReq}>Log In</button>
            </div>
          </div>
          <div className="registerButton">
            <button onClick={() => navigate("/register")}>Register</button>
          </div>
        </div>
      </div>
    </div>
  );
}
