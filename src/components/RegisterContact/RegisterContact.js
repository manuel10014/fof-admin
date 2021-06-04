import React, { useState, useEffect } from "react";
import "./RegisterContact.css";
import axios from "axios";
import CustomToast from "../custom-toast";
import { toast } from "react-toastify";
import citiesJSON from "./colombia";
import { TUNNEL } from '../../assets/constants/url'
import { DropdownList } from 'react-widgets'
import { confirmAlert } from 'react-confirm-alert' // Import

const RegisterContact = ({
  editing,
  selectedContact,
  setShowEditContact,
  ...props
}) => {
  const [firstName, setFirstName] = useState("");
  const [secondName, setSecondName] = useState("");
  const [lastName, setLastName] = useState("");
  const [secondLast, setSecondLast] = useState("");
  const [position, setPosition] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [department, setDepartment] = useState("");
  const [cities, setCities] = useState([]);
  const allDepartments = citiesJSON.map((ele) => ele.departamento);
  const [isContactActive, setIsContactActive] = useState(null)
  
  const handleDepartmentChange = (value) => {
    setCities([]);
    setCity("");
    setDepartment(value);
  };

  useEffect(() => {
    if (department !== "") {
      const listCities = citiesJSON.filter(
        (ele) => ele.departamento === department
      )[0].ciudades;
      setCities(listCities);
    }
  }, [department]);

  useEffect(() => {
    if (editing === true) {
      const {
        firstName,
        secondName,
        lastName,
        secondLastName,
        city,
        phone,
        position
      } = selectedContact;
      setFirstName(firstName);
      setSecondName(secondName);
      setLastName(lastName);
      setSecondLast(secondLastName);
      setDepartment(department);
      setCity(city);
      setPhone(phone);
      setPosition(position)
      setIsContactActive(true)
    }
  }, [editing]);

  const register = async () => {
    const user = {
        firstName: firstName.trim(),
        secondName: secondName.trim(),
        lastName: lastName.trim(),
        secondLast: secondLast.trim(),
        phone,
        city,
        department,
        position,
      };
        try {
          const config = {
            headers: {
              "Content-Type": "application/json",
            },
          };
          const body = JSON.stringify(user);
          const res = await axios.post(
            `${TUNNEL}/api/users/contact`,
            body,
            config
          );
          toast(<CustomToast title="¡Registro exitoso!" />);
        } catch (err) {
          toast(<CustomToast title={err.response.data.errors[0].msg} />);
        }
  };

  const editContact = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    let errors = 0;
    try{
        const user = {
            firstName: firstName.trim(),
            secondName: secondName.trim(),
            lastName: lastName.trim(),
            secondLast: secondLast.trim(),
            phone,
            city,
            department,
            position,
            contactID: selectedContact._id,
        };
        const body = JSON.stringify(user);
        if (errors === 0) {
          const resServer = await axios.post(
            `${TUNNEL}/api/users/contact-edit`,
            body,
            config
        );
        toast(<CustomToast title={resServer.data} />);
        }
    } catch (err) {
      toast(<CustomToast title={err.response.data.errors[0].msg} />);
    }
  };

  const disableContact = async () => {
    try {
      const user = {
        contactID: selectedContact._id,
      };
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const body = JSON.stringify(user);
      const res = await axios.post(
        `${TUNNEL}/api/users/deactivate-contact`,
        body,
        config
      );
      toast(<CustomToast title="Contacto deshabilitado." />);
      setIsContactActive(false);
    } catch (e) {
      console.log(e);
    }
  };

  const enableContact = async () => {
    try {
      const user = {
        contactID: selectedContact._id,
      };
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const body = JSON.stringify(user);
      const res = await axios.post(
        `${TUNNEL}/api/users/activate-contact`,
        body,
        config
      );
      toast(<CustomToast title="Contato habilitado." />);
      setIsContactActive(true);
    } catch (e) {
      console.log(e);
    }
  };

  const confirmAlertEditing = () => {
    confirmAlert({
      title: 'Confirmación de edición',
      message: `¿Está seguro/a que desea editar al contacto?`,
      buttons: [
        {
          label: 'Sí',
          onClick: () => editContact(),
        },
        {
          label: 'No',
        },
      ],
    })
  }

  const confirmAlertRegister = () => {
    confirmAlert({
      title: 'Confirmación de registro',
      message: `¿Está seguro/a que desea registrar un contacto?`,
      buttons: [
        {
          label: 'Sí',
          onClick: () => register(),
        },
        {
          label: 'No',
        },
      ],
    })
  }

  const confirmAlertEnable = () => {
    confirmAlert({
      title: 'Confirmación de habilitación',
      message: `¿Está seguro/a que desea habilitar al contacto?`,
      buttons: [
        {
          label: 'Sí',
          onClick: () => enableContact(),
        },
        {
          label: 'No',
        },
      ],
    })
  }

  const confirmAlertDisable = () => {
    confirmAlert({
      title: 'Confirmación de deshabilitación',
      message: `¿Está seguro/a que desea deshabilitar al contacto?`,
      buttons: [
        {
          label: 'Sí',
          onClick: () => disableContact(),
        },
        {
          label: 'No',
        },
      ],
    })
  }
  return (
    <div
      style={{
        display: "flex",
        overflow: "hidden",
        alignItems: "center",
      }}
    >
      <div className="formDiv">
        <div className="divRow"></div>
        <div className="twoContainer" style={{ paddingBottom: 0 }}>
      <div className="inputCol">
        <div className="textDiv">Primer Nombre:</div>
        <input
          name="First Name"
          type="text"
          placeholder="Primer Nombre"
          className="inputSignUp"
          value={firstName}
          required
          onChange={(evt) => setFirstName(evt.target.value)}
        />
      </div>
      <div className="inputCol">
        <div className="textDiv">Segundo Nombre:</div>
        <input
          name="Second Name"
          type="text"
          placeholder="Segundo Nombre"
          className="inputSignUp"
          value={secondName}
          required
          onChange={(evt) => setSecondName(evt.target.value)}
        />
      </div>
    </div>

    <div className="twoContainer">
      <div className="inputCol">
        <div className="textDiv">Primer Apellido:</div>
        <input
          name="First Last Name"
          type="text"
          placeholder="Primer Apellido"
          className="inputSignUp"
          value={lastName}
          required
          onChange={(evt) => setLastName(evt.target.value)}
        />
      </div>

      <div className="inputCol">
        <div className="textDiv">Segundo Apellido:</div>
        <input
          name="Second Last"
          type="text"
          placeholder="Segundo Apellido"
          className="inputSignUp"
          value={secondLast}
          required
          onChange={(evt) => setSecondLast(evt.target.value)}
        />
      </div>
    </div>

    <div className="twoContainer">
      <div className="inputCol">
        <div className="textDiv">Cargo:</div>
        <input
          name="Cargo"
          type="text"
          placeholder="Cargo"
          className="inputSignUp"
          value={position}
          required
          onChange={(evt) => setPosition(evt.target.value)}
        />
      </div>

      <div className="inputCol">
        <div className="textDiv">Número telefonico</div>
        <input
          name="Cédula"
          type="text"
          placeholder="Cédula de ciudadania"
          className="inputSignUp"
          value={phone}
          required
          onChange={(evt) => setPhone(evt.target.value)}
        />
      </div>
    </div>

    <div className="testContainer">
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '50%',
        }}
      >
        <div className="textDiv" style={{ marginLeft: '20%' }}>
          Departamento:
        </div>

        <DropdownList
          style={{
            width: '83%',

            borderColor: 'lightgray',
          }}
          data={allDepartments}
          value={department}
          onChange={(value) => handleDepartmentChange(value)}
          placeholder={'Departamento'}
        />
      </div>
      <div
        style={{ display: 'flex', flexDirection: 'column', width: '50%' }}
      >
        <div className="textDiv" style={{ marginLeft: '20%' }}>
          Ciudad:
        </div>
        <DropdownList
          style={{ width: '85%', marginLeft: '19%' }}
          value={city}
          data={cities}
          onChange={(value) => setCity(value)}
          placeholder={'Ciudad'}
        />
      </div>
    </div>
    <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            marginTop: '5vh',
            alignContent: 'center',
            justifyItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              alignItems: 'center',
              alignContent: 'center',
              marginRight: 30,
              textAlign: 'center',
            }}
          >
          </div>
          {editing && isContactActive ? (
            <input
              name=""
              type="submit"
              className="buttonSignUp"
              value="Deshabilitar"
              onClick={() => confirmAlertDisable()}
              style={{ marginRight: '5%', marginTop: '15px' }}
            />
          ) : (
            editing &&
            !isContactActive && (
              <input
                name=""
                type="submit"
                className="buttonSignUp"
                value="Habilitar"
                onClick={() => confirmAlertEnable()}
                style={{ marginRight: '5%', marginTop: '15px' }}
              />
            )
          )}
          <div
            style={{
              alignItems: 'center',
              alignContent: 'center',
              textAlign: 'center',
              marginLeft: '30px',
            }}
          >
            <img
              name=""
              alt=""
              type="submit"
              src={require('./mark.png').default}
              className="back-button-register-employee"
              onClick={() => {
                if (!editing) {
                  confirmAlertRegister()
                } else {
                  confirmAlertEditing()
                }
              }}
            />
            <div
              style={{
                fontSize: 12,
                fontWeight: 'bold',
                color: 'gray',
                textAlign: 'center',
                alignSelf: 'center',
              }}
            >
              {!editing ? 'REGISTRAR' : 'EDITAR'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterContact;
