import React, { useState, useEffect } from 'react'
import './RegisterAdmin.css'
import citiesJSON from '../RegisterEmployee/colombia'
import axios from 'axios'
import CustomToast from '../custom-toast'
import { toast } from 'react-toastify'
import { DropdownList } from 'react-widgets'
import BackArrow from '../../assets/images/backarrow.png'
import { confirmAlert } from 'react-confirm-alert' // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css
import { TUNNEL } from '../../assets/constants/url'

const RegisterAdmin = ({
  selectedAdmin,
  editing,
  setShowEditAdmin,
  ...props
}) => {
  const [firstName, setFirstName] = useState('')
  const [secondName, setSecondName] = useState('')
  const [lastName, setLastName] = useState('')
  const [secondLast, setSecondLast] = useState('')
  const [citizenID, setCitizenID] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [city, setCity] = useState('')
  const [department, setDepartment] = useState('')
  const [password, setPassword] = useState('')
  const [confPass, setConfPass] = useState('')
  const [cities, setCities] = useState([])
  const [isActive, setIsActive] = useState(true)
  const allDepartments = citiesJSON.map((ele) => ele.departamento)

  useEffect(() => {
    if (department !== '') {
      const listCities = citiesJSON.filter(
        (ele) => ele.departamento === department,
      )[0].ciudades
      setCities(listCities)
    }
  }, [department])
  useEffect(() => {
    if (selectedAdmin) {
      setIsActive(selectedAdmin.active)
    }
  }, [selectedAdmin])

  useEffect(() => {
    if (editing === true) {
      const {
        firstName,
        secondName,
        lastName,
        secondLastName,
        citizenID,
        city,
        department,
        phone,
        email,
      } = selectedAdmin
      setFirstName(firstName)
      setSecondName(secondName)
      setLastName(lastName)
      setSecondLast(secondLastName)
      setEmail(email)
      setCitizenID(citizenID)
      setDepartment(department)
      setCity(city)
      setPhone(phone)
    }
  }, [editing])

  const handleDepartmentChange = (value) => {
    setCities([])
    setCity('')
    setDepartment(value)
  }

  const register = async () => {
    const user = {
      firstName: firstName.trim(),
      secondName: secondName.trim(),
      lastName: lastName.trim(),
      secondLast: secondLast.trim(),
      citizenID,
      phone,
      email: email.trim(),
      city,
      department,
      password,
      passRepeat: confPass,
    }
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      }
      const body = JSON.stringify(user)
      const res = await axios.post(`${TUNNEL}/api/admin/register`, body, config)

      toast(<CustomToast title="¡Registro exitoso!" />)
    } catch (err) {
      toast(<CustomToast title={err.response.data.errors[0].msg} />)
    }
  }
  const disableAdmin = async () => {
    try {
      const user = {
        adminID: selectedAdmin._id,
      }
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      }
      const body = JSON.stringify(user)
      const res = await axios.post(
        `${TUNNEL}/api/admin/deactivate-admin`,
        body,
        config,
      )
      toast(<CustomToast title="¡Administrador deshabilitado!" />)
      setIsActive(false)
    } catch (e) {
      console.log(e)
    }
  }
  const enableAdmin = async () => {
    try {
      const user = {
        adminID: selectedAdmin._id,
      }
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      }
      const body = JSON.stringify(user)
      const res = await axios.post(
        `${TUNNEL}/api/admin/activate-admin`,
        body,
        config,
      )
      toast(<CustomToast title="¡Administrador habilitado!" />)
      setIsActive(true)
    } catch (e) {
      console.log(e)
    }
  }

  const editAdmin = async () => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    }

    try {
      const user = {
        firstName: firstName.trim(),
        secondName: secondName.trim(),
        lastName: lastName.trim(),
        secondLast: secondLast.trim(),
        citizenID,
        phone,
        email: email.trim(),
        city,
        department,
        adminID: selectedAdmin._id,
      }
      const body = JSON.stringify(user)

      const resServer = await axios.post(
        `${TUNNEL}/api/admin/edit`,
        body,
        config,
      )
      toast(<CustomToast title={resServer.data} />)
    } catch (err) {
      toast(<CustomToast title={err.response.data.errors[0].msg} />)
    }
  }

  const confirmAlertEditing = () => {
    confirmAlert({
      title: 'Confirmación de edición',
      message: `¿Está seguro/a que desea editar al administrador?`,
      buttons: [
        {
          label: 'Sí',
          onClick: () => editAdmin(),
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
      message: `¿Está seguro/a que desea registrar al administrador?`,
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
      message: `¿Está seguro/a que desea habilitar al administrador?`,
      buttons: [
        {
          label: 'Sí',
          onClick: () => enableAdmin(),
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
      message: `¿Está seguro/a que desea deshabilitar al administrador?`,
      buttons: [
        {
          label: 'Sí',
          onClick: () => disableAdmin(),
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
        display: 'flex',
        overflow: 'hidden',
      }}
    >
      <div className="formDiv">
        {/* {editing && (
          <img
            alt=""
            src={BackArrow}
            className="back-arrow"
            style={{ position: "fixed", left: "380px", top: "270px" }}
            onClick={() => setShowEditAdmin(false)}
          />
        )} */}
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
              placeholder="Primera Apellido"
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
            <div className="textDiv">Correo electrónico:</div>
            <input
              name="Email"
              type="text"
              disabled={editing}
              placeholder="Correo electrónico"
              className="inputSignUp"
              value={email}
              required
              onChange={(evt) => setEmail(evt.target.value)}
            />
          </div>

          <div className="inputCol">
            <div className="textDiv">Cédula de ciudadanía:</div>
            <input
              name="Cédula"
              type="text"
              placeholder="Cédula de ciudadania"
              className="inputSignUp"
              value={citizenID}
              required
              onChange={(evt) => setCitizenID(evt.target.value)}
            />
          </div>
        </div>
        <div className="twoContainer" style={{ display: editing && 'none' }}>
          <div className="inputCol">
            <div className="textDiv">Contraseña:</div>
            <input
              name="Pass"
              type="password"
              placeholder="******"
              className="inputSignUp"
              value={password}
              required
              onChange={(evt) => setPassword(evt.target.value)}
            />
          </div>

          <div className="inputCol">
            <div className="textDiv">Confirmar contraseña:</div>
            <input
              name="PassConf"
              type="password"
              placeholder="*******"
              className="inputSignUp"
              value={confPass}
              required
              onChange={(evt) => setConfPass(evt.target.value)}
            />
          </div>
        </div>

        <div className="testContainer">
          <div
            style={{ display: 'flex', flexDirection: 'column', width: '50%' }}
          >
            <div className="textDiv" style={{ marginLeft: '20%' }}>
              Departamento:
            </div>
            <DropdownList
              style={{ width: '80%', marginLeft: '20%' }}
              data={allDepartments}
              value={department}
              onChange={(value) => handleDepartmentChange(value)}
              placeholder={'Departamento'}
            />
          </div>
          <div
            style={{ display: 'flex', flexDirection: 'column', width: '50%' }}
          >
            <div className="textDiv" style={{ marginLeft: '22%' }}>
              Ciudad:
            </div>
            <DropdownList
              style={{ width: '82%', marginLeft: '22%' }}
              value={city}
              data={cities}
              onChange={(value) => setCity(value)}
              placeholder={'Ciudad'}
            />
          </div>
        </div>

        <div className="twoContainer">
          {/* <div className="inputCol">
          <div className="textDiv">Dirección:</div>
          <input
            name="Pass"
            type="text"
            placeholder="Dirección"
            className="inputSignUp"
            value={address}
            required
            onChange={(evt) => setAddress(evt.target.value)}
          />
        </div> */}
          <div className="inputCol">
            <div className="textDiv">Número telefónico:</div>
            <input
              name="Pass"
              type="text"
              placeholder="Número telefónico"
              className="inputSignUp"
              value={phone}
              required
              onChange={(evt) => setPhone(evt.target.value)}
            />
          </div>
        </div>
        <div className="twoContainer">
          {!editing && (
            <input
              name=""
              type="submit"
              className="buttonSignUp"
              value="Registrar"
              onClick={() => confirmAlertRegister()}
            />
          )}
          {editing && (
            <input
              name=""
              type="submit"
              className="buttonSignUp"
              value="Editar"
              onClick={() => confirmAlertEditing()}
            />
          )}
          {editing && isActive && (
            <input
              name=""
              type="submit"
              className="buttonSignUp"
              value="Deshabilitar"
              onClick={() => confirmAlertDisable()}
            />
          )}
          {editing && !isActive && (
            <input
              name=""
              type="submit"
              className="buttonSignUp"
              value="Habilitar"
              onClick={() => confirmAlertEnable()}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default RegisterAdmin
