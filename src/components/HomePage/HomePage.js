import React from "react";
import Login from "../LogInBox/Login";
import imagenHouseekeeper1 from "../../assets/images/Background-ingreso-plataforma.png";
import CustomToast from "../custom-toast";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { signInSuccess, signInFail } from "../../actions/index";
import "./HomePage.css";
import { TUNNEL } from '../../assets/constants/url'

const HomePage = () => {
  const dispatch = useDispatch();
  let history = useHistory();
  const handleLogin = async (usern, password) => {
    // User can be either username or password
    const user = {
      usern: usern.toLowerCase().trim(),
      password,
    };
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const body = JSON.stringify(user);
      const res = await axios.post(`${TUNNEL}/api/auth/admin`, body, config);
      dispatch(signInSuccess(res.data));
      history.push("/agenda");
      toast(<CustomToast title="¡Credenciales correctas!" />);
    } catch (err) {
      dispatch(signInFail(err));
      toast(<CustomToast title={err.response.data.errors[0].msg} />);
    }
  };
  return (
    <div className="main__content">
      <img src={imagenHouseekeeper1} alt="" className="background-login" />

      <Login handleLogin={handleLogin} />

      <div className="shadow"></div>      
    </div>
  );
};

export default HomePage;
