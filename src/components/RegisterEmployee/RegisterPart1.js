import React, { useState, useEffect, useRef } from 'react'
import { DropdownList } from 'react-widgets'
import ProfilePic from './userDefault.png'
import BackArrow from '../../assets/images/backarrow.png'
import { TUNNEL } from '../../assets/constants/url'
const RegisterPart1 = ({
  editing,
  selectedEmployee,
  setFirstName,
  firstName,
  secondName,
  setSecondName,
  lastName,
  setLastName,
  secondLast,
  setSecondLast,
  citizenID,
  setCitizenID,
  phone,
  setPhone,
  email,
  setEmail,
  profilePic,
  setProfilePic,
  city,
  setCity,
  department,
  setDepartment,
  setNext,
  cities,
  setCities,
  allDepartments,
  handleDepartmentChange,
  address,
  setAddress,
  readFile,
  fileB,
  fileFB,
  setShowEditEmployee,
  ...props
}) => {
  const upload = useRef()

  const handleClick = () => {
    upload.current.click()
  }

  return (
    <div style={{ width: '100%', height: '100%', justifyContent: 'center' }}>
      <div className="formDiv">
        <div className="divRow">
          {!editing ? (
            <img
              className="image-profile-register-employee"
              alt="profile_default"
              src={fileB !== null ? fileB : ProfilePic}
              onClick={handleClick}
            />
          ) : (
            <img
              className="image-profile-register-employee"
              alt="profile_default"
              src={
                fileB !== null
                  ? fileB
                  : `${TUNNEL}/api/files/employee-img/${selectedEmployee._id}`
              }
              onClick={handleClick}
            />
          )}
        </div>
        <input
          id="upload"
          ref={upload}
          type="file"
          accept="image/*" // put to accept only jpg and png cause of multer
          onInput={readFile}
          onClick={(event) => {
            event.target.value = null
          }}
          style={{ display: 'none' }}
        />
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
            <div className="textDiv">Correo electrónico:</div>
            <input
              name="Email"
              type="text"
              placeholder="Correo electrónico"
              className="inputSignUp"
              value={email}
              disabled={editing}
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

        <div className="testContainer">
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '45%',
              marginLeft: "10%"
            }}
          >
            <div className="textDiv" style={{ marginLeft: '20%' }}>
              Departamento:
            </div>

            <DropdownList
              style={{
                width: '90%',
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
              style={{ width: '80%', marginLeft: '19%' }}
              value={city}
              data={cities}
              onChange={(value) => setCity(value)}
              placeholder={'Ciudad'}
            />
          </div>
        </div>

        <div className="twoContainer">
          <div className="inputCol">
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
          </div>
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
        <div
          style={{ display: 'flex', flexDirection: 'row', marginTop: '2vh' }}
        >
          {editing ? (
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <div
                style={{
                  alignItems: 'center',
                  alignContent: 'center',
                  marginRight: 30,
                  textAlign: 'center',
                }}
              >
                <img
                  alt=""
                  src={require("./regresar.png").default}
                  className="back-button-register-employee"
                  onClick={() => setShowEditEmployee(false)}
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
                  REGRESAR
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <img
                  src={require("./avanzar.png").default}
                  className="back-button-register-employee"
                  alt=""
                  onClick={() => setNext(true)}
                />
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 'bold',
                    color: 'gray',
                    textAlign: 'center',
                  }}
                >
                  CONTINUAR
                </div>
              </div>
            </div>
          ) : (
            <div>
              <img
                src={require('./avanzar.png').default}
                className="advance-icon-register-employee"
                onClick={() => setNext(true)}
                alt=""
              />
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 'bold',
                  color: 'gray',
                  textAlign: 'center',
                }}
              >
                CONTINUAR
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default RegisterPart1
