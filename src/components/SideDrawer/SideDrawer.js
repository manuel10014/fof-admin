import React from "react";
import "./SideDrawer.css";
import { Link } from "react-router-dom";
import * as ROUTES from "../../routes/Routes";

const sideDrawer = (props) => {
  let classN = props.shown ? "side-drawer open" : "side-drawer";

  return (
    <nav className={classN}>
      <ul>
        <li>
          <Link onClick={props.click} to={ROUTES.AGENDA}>
            Agenda
          </Link>
        </li>
        <li>
          <Link onClick={props.click} to={ROUTES.EMPLOYEE_DIRECTORY}>
            Directorio Empleadas
          </Link>
        </li>
        <li>
          <Link onClick={props.click} to={ROUTES.CLIENT_DIRECTORY}>
            Directorio Clientes
          </Link>
        </li>
        <li>
          <Link onClick={props.click} to={ROUTES.ADMIN_DIRECTORY}>
            Directorio Admin
          </Link>
        </li>
        <li>
          <Link onClick={props.click} to={ROUTES.SERVICE_DIRECTORY}>
            Servicios
          </Link>
        </li>
        <li>
          <Link onClick={props.click} to={ROUTES.REGISTER_SERVICE}>
            Registrar Servicio
          </Link>
        </li>
        <li>
          <Link onClick={props.click} to={ROUTES.EDIT_SERVICE}>
            Editar Servicio
          </Link>
        </li>
        <li>
          <Link onClick={props.click} to={ROUTES.REPORTS}>
            Reportes
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default sideDrawer;
