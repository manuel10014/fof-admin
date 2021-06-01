import React, { useState, useEffect } from "react";
import "./App.css";
import Toolbar from "./components/Toolbar/Toolbar";
import SideDrawer from "./components/SideDrawer/SideDrawer";
import Backdrop from "./components/Backdrop/Backdrop";
import * as ROUTES from "./routes/Routes";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import SignIn from "./components/SignIn/SignIn";
import HomePage from "./components/HomePage/HomePage";
import RegisterEmployee from "./components/RegisterEmployee/RegisterEmployee";
import RegisterService from "./components/RegisterService/RegisterService";
import EditService from "./components/EditService/EditService";
import EmployeeDirectory from "./components/EmployeeDirectory/EmployeeDirectory";
import ClientDirectory from "./components/ClientDirectory/ClientDirectory";
import ServiceDirectory from "./components/ServiceDirectory/ServiceDirectory";
import ServiceUser from "./components/ServiceUser/ServiceUser";
import AdminDirectory from "./components/AdminDirectory/AdminDirectory";
import Agenda from "./components/Agenda/Agenda";
import ForgotPW from "./components/ForgotPW/ForgotPW";
import ChangePW from "./components/ChangePW/ChangePW";
import Contacts from "./components/Contacts/Contacts";
import Reports from "./components/Reports/Reports";
import { toast } from "react-toastify";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { userLoaded, receiveNotification } from "./actions/index";
import "react-toastify/dist/ReactToastify.css";
import CustomToast from "./components/custom-toast";
import Pusher from "pusher-js";
import { TUNNEL } from "./assets/constants/url";
import { RemoveScrollBar } from "react-remove-scroll-bar";
// Watch "./App.css for @media syntax"
toast.configure({
  autoClose: 8000,
  draggable: false,
});

function App() {
  const token = useSelector((state) => state.auth.token);
  const notifyAlerts = useSelector((state) => state.auth.receiveNotification);
  const dispatch = useDispatch();
  const [sideDrawerOpen, setSideDrawerOpen] = useState(false);
  const drawerToggleClickHandler = () => {
    setSideDrawerOpen(!sideDrawerOpen);
  };

  const getAdminInfo = async (token) => {
    const config = {
      headers: {
        "content-type": "application/json",
        "x-auth-token": token,
      },
    };
    try {
      let res = await axios.get(`${TUNNEL}/api/auth/admin`, config);
      dispatch(userLoaded(res.data));
      dispatch(receiveNotification(true));
    } catch (e) {
      dispatch(receiveNotification(false));
      dispatch(userLoaded({}));
    }
  };

  useEffect(() => {
    if (token) {
      getAdminInfo(token);
    } else {
      dispatch(userLoaded({}));
    }
  }, [token]);

  useEffect(() => {
    const pusher = new Pusher("0fe647d7c6dd95bb7af7", {
      cluster: "us2",
    });
    const panicButtonChannel = pusher.subscribe("panic-button-alert");
    if (notifyAlerts === true) {
      panicButtonChannel.bind("inserted", (data) => {
        if (data.message) {
          toast(<CustomToast title={data.message} />);
        }
      });
    }
    if (notifyAlerts === false) {
      panicButtonChannel.unbind_all();
      panicButtonChannel.unsubscribe();
    }
    return () => {
      panicButtonChannel.unbind_all();
      panicButtonChannel.unsubscribe();
    };
  }, [notifyAlerts]);

  return (
    <Router>
      <div className="totalContainer">
        <RemoveScrollBar />

        <Toolbar sideFunction={drawerToggleClickHandler} />
        {sideDrawerOpen && <Backdrop click={drawerToggleClickHandler} />}
        <SideDrawer shown={sideDrawerOpen} click={drawerToggleClickHandler} />

        <div>
          <Switch>
            <Route
              exact
              initial={true}
              path={ROUTES.HOME}
              component={HomePage}
            />

            <Route
              exact
              path={ROUTES.SPECIFIC_SERVICE}
              component={ServiceUser}
            />
            <Route exact path={ROUTES.CHANGEPW} component={ChangePW} />
            <Route exact path={ROUTES.REPORTS} component={Reports} />
            <Route exact path={ROUTES.FORGOTPW} component={ForgotPW} />
            <Route
              exact
              path={ROUTES.ADMIN_DIRECTORY}
              component={AdminDirectory}
            />

            <Route
              exact
              path={ROUTES.REGISTER_SERVICE}
              component={RegisterService}
            />
            <Route exact path={ROUTES.AGENDA} component={Agenda} />
            <Route exact path={ROUTES.EDIT_SERVICE} component={EditService} />

            <Route
              exact
              path={ROUTES.EMPLOYEE_DIRECTORY}
              component={EmployeeDirectory}
            />
            <Route
              exact
              path={ROUTES.SERVICE_DIRECTORY}
              component={ServiceDirectory}
            />
            <Route
              exact
              path={ROUTES.CLIENT_DIRECTORY}
              component={ClientDirectory}
            />
            <Route
              exact
              path={ROUTES.CONTACTS}
              component={Contacts}
            />
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;