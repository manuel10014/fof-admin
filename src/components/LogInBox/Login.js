import React, { useState } from "react";
import Logo from "../../assets/images/Logo-HouseKeeper365.png";
import { withRouter } from "react-router-dom";
import "./Login.css";

const Login = ({ handleLogin, ...props }) => {
  const [userLogin, setUserLogin] = useState("");
  const [pwLogin, setPwLogin] = useState("");

  return (
    <div className="login-container">
      <div className="header-login">PORTAL DE ADMIN</div>
      <div className="header-img-login">
        <img src={Logo} alt="" className="header-img-login" />
      </div>
      {/* User Inputs for Sign in */}
      <input
        className={"user-input-login1"}
        type="text"
        placeholder="C o r r e o"
        value={userLogin}
        onChange={(e) => setUserLogin(e.target.value)}
      ></input>
      <input
        className={"user-input-login1"}
        type="password"
        placeholder="C o n t r a s e ñ a"
        value={pwLogin}
        onChange={(e) => setPwLogin(e.target.value)}
      ></input>

      {/* Buttons */}
      <div className="login-btns" style={{ justifyContent: "center" }}>
        <button
          className="login-btn-signin"
          onClick={() => handleLogin(userLogin, pwLogin)}
        >
          INGRESAR
        </button>
      </div>
      {/* PW Recovery */}
      <div className="text-pw-recovery">Si tienes problemas para ingresar,</div>
      <div className="text-pw-recovery2">
        dale{" "}
        <span onClick={() => props.history.push("/forgotpw")}>click aquí.</span>
      </div>
    </div>
  );
};

export default withRouter(Login);
