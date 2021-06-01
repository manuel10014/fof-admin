import React, { useState, useEffect } from "react";
import ServiceViewer from "../ServiceViewer/ServiceViewer";
import DatePicker from "react-datepicker";
import TimePicker from "rc-time-picker";
import CustomToast from "../custom-toast";
import { toast } from "react-toastify";
import axios from "axios";
import { withRouter } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import "rc-time-picker/assets/index.css";
import BackArrow from "../../assets/images/backarrow.png";
import "./EmployeeProfile.css";
import { TUNNEL } from '../../assets/constants/url'

const EmployeeProfile = ({
  employee,
  showEditMenu,
  showServices,
  setShowServices,
  showEmployeeRestrictions,
  setShowEmployeeRestrictions,
  ...props
}) => {
  const [dayToOccupy, setDayToOcuppy] = useState(new Date());
  const [firstHourToOccupy, setFirstHourToOcuppy] = useState(0);
  const [secondHourToOccupy, setSecondHourToOccupy] = useState(0);
  const [hourRight, setHourRight] = useState(false);
  const [dateRight, setDateRight] = useState(false);
  const [showAddRestrictionButton, setShowAddRestrictionButton] = useState(
    false
  );
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    if (counter > 0) {
      const minDate =
        new Date(
          dayToOccupy.getFullYear(),
          dayToOccupy.getMonth(),
          dayToOccupy.getDate()
        ).getTime() / 1000;
      if (firstHourToOccupy >= secondHourToOccupy && secondHourToOccupy !== 0) {
        toast(
          <CustomToast title="¡La hora inicial no pueda ser mayor o igual que la final!" />
        );
        setHourRight(false);
      }
      if (firstHourToOccupy < secondHourToOccupy) {
        setHourRight(true);
      }

      if (minDate + 3600 * firstHourToOccupy > new Date().getTime() / 1000) {
        setDateRight(true);
      } else {
        toast(
          <CustomToast title="¡El horario de restricción tiene que ser después de la fecha y hora actual!" />
        );
        setDateRight(false);
      }
    }

    setCounter(counter + 1);
    return () => {
      setCounter(0);
    };
  }, [firstHourToOccupy, secondHourToOccupy, dayToOccupy]);

  useEffect(() => {
    if (hourRight && dateRight) {
      setShowAddRestrictionButton(true);
    } else {
      setShowAddRestrictionButton(false);
    }
  }, [hourRight, dateRight]);

  const checkAvailability = async () => {
    const minDate =
      new Date(
        dayToOccupy.getFullYear(),
        dayToOccupy.getMonth(),
        dayToOccupy.getDate()
      ).getTime() / 1000;
    const lowerLimitOfSlot = minDate + 3600 * firstHourToOccupy;
    const upperLimitOfSlot = minDate + 3600 * secondHourToOccupy;

    const restrictions = {
      lowerRestriction: lowerLimitOfSlot.toString(),
      upperRestriction: upperLimitOfSlot.toString(),
      lowerLimitOfSlot,
      upperLimitOfSlot,
      employeeID: employee._id,
    };
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const body = JSON.stringify(restrictions);
      const res = await axios.post(
        `${TUNNEL}/api/users/employee/add-restriction`,
        body,
        config
      );

      toast(<CustomToast title={res.data.msg} />);
    } catch (e) {
      console.log(e);
    }
  };
  return !showServices && !showEmployeeRestrictions ? (
    <div className="employee-profile-container">
      <div className="employee-profile-title">DIRECTORIO DE EMPLEADAS</div>
      <div className="employee-profile-info-container">
        <img
          className="employee-profile-image"
          alt="Employee_Profile_Picture"
          src={`${TUNNEL}/api/files/employee-img/${employee._id}`}
        />
        <div className="employee-total-description">
          <div
            style={{
              color: "#114a9f",
              textTransform: "uppercase",
              fontSize: "20px",
              fontWeight: "bold",
              alignSelf: "center",
              marginBottom: 20,
            }}
          >
            <span>{employee.fullName}</span>
          </div>
          <div className="employee-profile-desc">
            <span>Calificación:</span> No disponible{" "}
          </div>
          <div className="employee-profile-desc">
            <span>Habilidades:</span>{" "}
            {employee.skills.map((skill, index) => {
              let stringOfSkills = "";
              if (index !== employee.skills.length - 1) {
                stringOfSkills = stringOfSkills + skill + ", ";
              } else {
                stringOfSkills = stringOfSkills + skill;
              }
              return stringOfSkills;
            })}{" "}
          </div>

          <div className="contact-info-profile">Información de Contacto</div>
          <div className="employee-profile-desc">
            <span>Dirección: </span> {employee.address}
          </div>
          <div className="employee-profile-desc">
            <span>Teléfono/Celular:</span> {employee.phone}{" "}
          </div>
          <div className="employee-profile-desc">
            <span>Departamento:</span> {employee.department}{" "}
          </div>
          <div className="employee-profile-desc">
            <span>Ciudad:</span> {employee.city}{" "}
          </div>
          <div className="employee-profile-desc">
            <span>Hoja de vida:</span>{" "}
            <a
              href={`${TUNNEL}/api/files/employee-CV/${employee._id}`}
              target="_blank"
            >
              Ver aquí
            </a>{" "}
          </div>
          <div className="employee-profile-desc">
            <span>ARL:</span>{" "}
            <a
              href={`${TUNNEL}/api/files/employee-ARL/${employee._id}`}
              target="_blank"
            >
              Ver aquí
            </a>{" "}
          </div>
        </div>
        <div className="button-container-profile-employee">
          <button className="button-edit" onClick={showEditMenu}>
            Editar Empleada
          </button>

          <button
            className="button-edit"
            onClick={() => {
              setShowServices(false);
              setShowEmployeeRestrictions(true);
            }}
          >
            Restricciones
          </button>

          <button
            className="button-edit"
            onClick={() => {
              setShowEmployeeRestrictions(false);
              setShowServices(true);
            }}
          >
            Servicios Programados
          </button>
        </div>
      </div>
    </div>
  ) : showServices && !showEmployeeRestrictions ? (
    <ServiceViewer
      isEmployee={true}
      id={employee._id}
      isServiceDirectory={false}
      setShowServices={setShowServices}
    />
  ) : (
    !showServices &&
    showEmployeeRestrictions && (
      <div className="employee-restrictions-container">
        <img
          alt=""
          src={BackArrow}
          className="back-arrow"
          onClick={() => setShowEmployeeRestrictions(false)}
        />
        <div
          style={{
            textAlign: "center",
            marginTop: "30px",
            marginBottom: "20px",
            textTransform: "uppercase",
          }}
        >
          {employee.fullName}{" "}
        </div>
        <div style={{ textAlign: "center", marginBottom: "10px" }}>
          Fecha de ausentismo:{" "}
        </div>
        <div
          style={{
            width: "30vh",
            alignSelf: "center",
            marginBottom: "20px",
            alignContent: "center",
          }}
        >
          <DatePicker
            selected={dayToOccupy}
            onChange={(date) => setDayToOcuppy(date)}
          />
        </div>
        <div
          style={{
            flexDirection: "row",
            display: "flex",
            justifyContent: "space-evenly",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div>Hora inicio: </div>
            <div className="margin">
              <TimePicker
                onChange={(value) => {
                  const selectedHour = value._d.toString();
                  let specificHour = parseInt(
                    selectedHour.substring(
                      selectedHour.indexOf(":") - 2,
                      selectedHour.indexOf(":")
                    )
                  );
                  setFirstHourToOcuppy(specificHour);
                }}
                showMinute={false}
                showSecond={false}
                allowEmpty={false}
                style={{
                  width: "10vw",
                  marginTop: "10px",
                }}
              />
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div>Hora fin: </div>
            <div className="margin">
              <TimePicker
                onChange={(value) => {
                  const selectedHour = value._d.toString();
                  let specificHour = parseInt(
                    selectedHour.substring(
                      selectedHour.indexOf(":") - 2,
                      selectedHour.indexOf(":")
                    )
                  );
                  setSecondHourToOccupy(specificHour);
                }}
                showMinute={false}
                showSecond={false}
                allowEmpty={false}
                style={{
                  width: "10vw",
                  marginTop: "10px",
                }}
              />
            </div>
          </div>
        </div>
        <button
          className="restriction-button"
          onClick={() => checkAvailability()}
          style={{ display: !showAddRestrictionButton && "none" }}
        >
          Añadir
        </button>
      </div>
    )
  );
};

export default withRouter(EmployeeProfile);
