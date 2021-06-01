import React, { useRef } from 'react'
import DocumentReady from '../../assets/images/DocumentReady.jpg'
import { confirmAlert } from 'react-confirm-alert' // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css

const RegisterPart2 = ({
  editing,
  selectedEmployee,
  password,
  setPassword,
  confPass,
  setConfPass,
  setNext,
  register,
  edit,
  skillModifier,
  skills,
  setSkills,
  skillRemover,
  fileARL,
  fileFARL,
  fileCV,
  fileFCV,
  readFileCV,
  readFileARL,
  disableMaid,
  enableMaid,
  active,
  ...props
}) => {
  const uploadCV = useRef()
  const uploadARL = useRef()

  const handleClickCV = () => {
    uploadCV.current.click()
  }

  const handleClickARL = () => {
    uploadARL.current.click()
  }

  const confirmAlertEditing = () => {
    confirmAlert({
      title: 'Confirmación de edición',
      message: `¿Está seguro/a que desea editar a la empleada?`,
      buttons: [
        {
          label: 'Sí',
          onClick: () => edit(),
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
      message: `¿Está seguro/a que desea registrar a la empleada?`,
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
      message: `¿Está seguro/a que desea habilitar a la empleada?`,
      buttons: [
        {
          label: 'Sí',
          onClick: () => enableMaid(),
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
      message: `¿Está seguro/a que desea deshabilitar a la empleada?`,
      buttons: [
        {
          label: 'Sí',
          onClick: () => disableMaid(),
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
        width: '100%',
        height: '100%',
      }}
    >
      <div className="formDiv2">
        <div
          style={{
            color: '#114a9f',
            textTransform: 'uppercase',
            fontSize: '20px',
            fontWeight: 'bold',
            alignSelf: 'center',
            marginBottom: 20,
            width: '100%',
            textAlign: 'center',
            marginBottom: '8vh',
          }}
        >
          <span>DATOS DE LA EMPLEADA</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <div className={fileCV !== null ? 'greenBox' : 'grayBox'}>
            <div style={{ alignSelf: 'center' }}>HOJA DE VIDA</div>
            <img
              className="plus-icon-register-employee-cv"
              alt="CV_default"
              src={fileCV !== null ? DocumentReady : require('./plusBlue.png')}
              onClick={handleClickCV}
            />
          </div>

          <input
            id="uploadCV"
            ref={uploadCV}
            type="file"
            accept="application/pdf" // put to accept only pdf
            onInput={readFileCV}
            onClick={(event) => {
              event.target.value = null
            }}
            style={{ display: 'none' }}
          />
          <div style={{ width: '4vw' }}></div>
          <div className={fileARL !== null ? 'greenBox' : 'grayBox'}>
            <div style={{ alignSelf: 'center' }}>ARL</div>
            <img
              alt="CV_default"
              src={fileARL !== null ? DocumentReady : require('./plusBlue.png')}
              onClick={handleClickARL}
              className="plus-icon-register-employee-arl"
            />
          </div>

          <input
            id="uploadARL"
            ref={uploadARL}
            type="file"
            accept="application/pdf" // put to accept only pdf
            onInput={readFileARL}
            onClick={(event) => {
              event.target.value = null
            }}
            style={{ display: 'none' }}
          />
        </div>

        <div
          style={{ display: 'flex', flexDirection: 'row', marginTop: '3vh' }}
        >
          <input
            name="Pass"
            type="password"
            placeholder="Crear Contraseña"
            className="inputSignUp"
            style={{ display: editing && 'none' }}
            value={password}
            required
            onChange={(evt) => setPassword(evt.target.value)}
          />
          <div style={{ width: '4vw' }}></div>
          <input
            name="PassConf"
            type="password"
            style={{ display: editing && 'none' }}
            placeholder="Confirmar Contraseña"
            className="inputSignUp"
            value={confPass}
            required
            onChange={(evt) => setConfPass(evt.target.value)}
          />
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            marginTop: '3vh',
          }}
        >
          <div className="skillContainer">
            {skills.map((ele, idx) => {
              return (
                <div key={idx}>
                  <input
                    name="Skills"
                    type="text"
                    placeholder="Habilidad"
                    className="abilitySignUp"
                    required
                    onChange={(e) => skillModifier(idx, e.target.value)}
                    value={ele}
                  />
                  {idx !== 0 && (
                    <img
                      name=""
                      alt=""
                      type="submit"
                      className="remove-icon-register-service"
                      style={{ marginLeft: '10px' }}
                      src={require('./remove.png')}
                      onClick={() => skillRemover(idx)}
                    />
                  )}
                </div>
              )
            })}
          </div>
          <div style={{ width: '1vw' }}></div>
          <input
            name=""
            type="submit"
            className="button-add-skills"
            value="<<   Agregar Habilidad"
            onClick={() => {
              setSkills((prevSkill) => [...prevSkill, ''])
            }}
          />
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
            <img
              name=""
              alt=""
              type="submit"
              src={require('./regresar.png')}
              className="back-button-register-employee"
              value="Regresar"
              onClick={() => setNext(false)}
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
          {editing && active ? (
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
            !active && (
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
              src={require('./mark.png')}
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
  )
}

export default RegisterPart2
