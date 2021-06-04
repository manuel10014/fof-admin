import React, { useEffect, useState } from 'react'
import axios from 'axios'
import citiesJSON from '../RegisterEmployee/colombia'
import { DropdownList } from 'react-widgets'
import CustomToast from '../custom-toast'
import { toast } from 'react-toastify'
import { handleRestriction } from '../RegisterService/registerServicefcts'
import { withRouter } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import RemoveIcon from '../RegisterEmployee/remove.png'
import { confirmAlert } from 'react-confirm-alert' // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css
import { TUNNEL } from '../../assets/constants/url'
import { timeConverter } from '../ServiceViewer/ServiceViewerFcts'

const EditService = (props) => {
  const [allServices, setAllServices] = useState([])
  const [currentService, setCurrentService] = useState({})
  const [serviceName, setServiceName] = useState('')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [durationHours, setDurationHours] = useState(1)
  const [citiesAvailable, setCitiesAvailable] = useState([])
  const [timeRestrictions, setTimeRestrictions] = useState([[0, 0]])
  const [activities, setActivities] = useState([''])
  const [windowWidth, setWindowWidth] = useState(null)
  const [windowHeight, setWindowHeight] = useState(null)
  const [department, setDepartment] = useState('')
  const [city, setCity] = useState('')
  const [cities, setCities] = useState([])
  const [price, setPrice] = useState(0)
  const [active, setActive] = useState(true)
  const [discount,setDiscount] = useState(0)
  const [surcharge,setSurcharge] = useState(0)
  const allDepartments = citiesJSON.map((ele) => ele.departamento)

  const userLoaded = useSelector((state) => state.auth.allUserInfo)
  const [stateCounter, setStateCounter] = useState(0)

  useEffect(() => {
    if (stateCounter > 0) {
      if (Object.entries(userLoaded).length === 0) {
        props.history.push('/')
      }
    }
    setStateCounter(stateCounter + 1)
  }, [userLoaded])

  const getAllServices = async () => {
    const config = {
      headers: {
        'content-type': 'application/json',
      },
    }
    try {
      const res = await axios.get(`${TUNNEL}/api/services/all-services`, config)
      setAllServices(res.data)
    } catch (e) {
      console.log(e.response.data)
    }
  }

  const miniTimeFunction = (time) => {
    let timeToReturn = ''
    if (time <= 9) {
      timeToReturn += '0' + time.toString()
    } else {
      timeToReturn += time.toString()
    }
    return (timeToReturn += ':00:00')
  }

  const handleDepartmentChange = (value) => {
    setCities([])
    setCity('')
    setDepartment(value)
  }

  const handleCityAdd = () => {
    if (city !== '' && !citiesAvailable.includes(city)) {
      setCitiesAvailable((prevCities) => [...prevCities, city])
    } else if (citiesAvailable.includes(city)) {
      toast(<CustomToast title="¡No puede repetir ciudades!" />)
    } else {
      toast(<CustomToast title="¡Seleccione una ciudad antes de agregar!" />)
    }
  }

  const cityRemover = (idx) => {
    setCitiesAvailable((prevCities) =>
      prevCities.filter((city, index) => index !== idx),
    )
  }

  const activityModifier = (idx, e) => {
    setActivities((prevActivities) => {
      let newActivities = [...prevActivities]
      newActivities[idx] = e
      return newActivities
    })
  }

  const activityRemover = (idx) => {
    setActivities((prevActivities) =>
      prevActivities.filter((activity, index) => index !== idx),
    )
  }

  const timeRestrictionModifier = (idx, e, inputNumber) => {
    // if the restriction number is between 0 and 24 inclusive
    if (!isNaN(e) && e >= 0 && e <= 24) {
      setTimeRestrictions((prevRestrictions) => {
        let newRestrictions = [...prevRestrictions]
        if (inputNumber === 1) {
          newRestrictions[idx][0] = e
        } else if (inputNumber === 2) {
          newRestrictions[idx][1] = e
        }
        return newRestrictions
      })
    }
  }

  const timeRestrictionRemover = (idx) => {
    setTimeRestrictions((prevRestrictions) =>
      prevRestrictions.filter((activity, index) => index !== idx),
    )
  }

  const handleServiceChange = (value) => {
    setServiceName(value)
  }

  useEffect(() => {
    if (serviceName !== '') {
      setCurrentService(
        allServices.filter((service) => service.name === serviceName),
      )
    }
  }, [serviceName])

  useEffect(() => {
    if (Object.entries(currentService).length > 0) {
      const {
        activities,
        citiesAvailable,
        timeRestrictions,
        name,
        durationHours,
        price,
        description,
        active,
        discount,
        surcharge
      } = currentService[0]
      setActivities(activities)
      setCitiesAvailable(citiesAvailable)
      setTimeRestrictions(timeRestrictions)
      setName(name)
      setDurationHours(durationHours)
      setPrice(price)
      setDescription(description)
      setActive(active)
      setDiscount(discount)
      setSurcharge(surcharge)
    }
  }, [currentService])

  const editService = async () => {
    if (Object.entries(currentService).length === 0) {
      toast(<CustomToast title="¡Seleccione servicio a editar!" />)
    } else {
      let verifyRestriction = handleRestriction(timeRestrictions, durationHours)
      if (verifyRestriction) {
        const service = {
          name: name.trim(),
          description,
          durationHours,
          citiesAvailable,
          timeRestrictions,
          activities,
          price,
          discount,
          surcharge,
          serviceID: currentService[0]._id,
        }
        try {
          const config = {
            headers: {
              'Content-Type': 'application/json',
            },
          }
          const body = JSON.stringify(service)
          const res = await axios.post(
            `${TUNNEL}/api/services/edit`,
            body,
            config,
          )
          toast(<CustomToast title="¡Servicio editado con éxito!" />)
        } catch (err) {
          toast(<CustomToast title={err.response.data.errors[0].msg} />)
        }
      }
    }
  }

  const deactivateService = async () => {
    if (Object.entries(currentService).length === 0) {
      toast(<CustomToast title="¡Seleccione servicio a desactivar!" />)
    } else {
      const service = {
        serviceID: currentService[0]._id,
      }
      try {
        const config = {
          headers: {
            'Content-Type': 'application/json',
          },
        }
        const body = JSON.stringify(service)
        const res = await axios.post(
          `${TUNNEL}/api/services/deactivate`,
          body,
          config,
        )
        toast(<CustomToast title="¡Servicio desactivado con éxito!" />)
        setActive(false)
      } catch (err) {
        toast(<CustomToast title={err.response.data.errors[0].msg} />)
      }
    }
  }

  const activateService = async () => {
    if (Object.entries(currentService).length === 0) {
      toast(<CustomToast title="¡Seleccione servicio a activar!" />)
    } else {
      const service = {
        serviceID: currentService[0]._id,
      }
      try {
        const config = {
          headers: {
            'Content-Type': 'application/json',
          },
        }
        const body = JSON.stringify(service)
        const res = await axios.post(
          `${TUNNEL}/api/services/activate`,
          body,
          config,
        )
        toast(<CustomToast title="¡Servicio activado con éxito!" />)
        setActive(true)
      } catch (err) {
        toast(<CustomToast title={err.response.data.errors[0].msg} />)
      }
    }
  }

  useEffect(() => {
    getAllServices()
  }, [])

  useEffect(() => {
    if (department !== '') {
      const listCities = citiesJSON.filter(
        (ele) => ele.departamento === department,
      )[0].ciudades
      setCities(listCities)
    }
  }, [department])

  const confirmAlertEditing = () => {
    confirmAlert({
      title: 'Confirmación de edición',
      message: `¿Está seguro/a que desea editar el servicio?`,
      buttons: [
        {
          label: 'Sí',
          onClick: () => editService(),
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
      message: `¿Está seguro/a que desea habilitar el servicio?`,
      buttons: [
        {
          label: 'Sí',
          onClick: () => activateService(),
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
      message: `¿Está seguro/a que desea deshabilitar el servicio?`,
      buttons: [
        {
          label: 'Sí',
          onClick: () => deactivateService(),
        },
        {
          label: 'No',
        },
      ],
    })
  }

  return (
    <div className="register-service-container">
      <div style={{ marginTop: '20px', marginBottom: '10px' }}>
        Seleccione servicio a editar:
      </div>
      <DropdownList
        style={{ width: '40%', margin: '0' }}
        data={allServices.map((service) => service.name)}
        value={serviceName}
        onChange={(value) => handleServiceChange(value)}
        placeholder={'Servicio'}
      />
      {Object.entries(currentService).length > 0 && (
        <div
          style={{ display: 'flex', flexDirection: 'column', width: '100%' }}
        >
          <div className="register-service-name">NOMBRE DEL SERVICIO: </div>
          <input
            name="Nombre"
            type="text"
            placeholder=""
            className="input-name-register-service"
            value={name}
            required
            onChange={(evt) => setName(evt.target.value)}
          />
          <div className="parameter-config-title">
            CONFIGURACIÓN DE PARÁMETROS
          </div>
          <div className="duration-price-container">
            <div className="duration-container">
              <div className="text-duration">DURACIÓN:</div>
              <input
                name="Duración"
                type="number"
                placeholder="Horas"
                className="input-name-register-service"
                min={1}
                value={durationHours}
                required
                onChange={(evt) => setDurationHours(evt.target.value)}
              />
            </div>
            <div className="duration-container">
              <div className="text-duration">PRECIO:</div>
              <input
                name="Precio"
                type="number"
                className="input-name-register-service"
                required
                onChange={(e) => setPrice(e.target.value)}
                value={price}
              />
            </div>
          </div>
          <div className="duration-price-container">
        <div className="duration-container">
          <div className="text-duration">DESCUENTO:</div>
          <input
            name="Descuento"
            type="number"
            className="input-name-register-service"
            required
            onChange={(e) => setDiscount(e.target.value)}
            value={discount}
          />
        </div>
        <div className="duration-container">
          <div className="text-duration">RECARGO:</div>
          <input
            name="Recargo"
            type="number"
            className="input-name-register-service"
            required
            onChange={(e) => setSurcharge(e.target.value)}
            value={surcharge}
          />
        </div>
      </div>
          <div className="city-department-container">
            <DropdownList
              style={{ width: '20%', margin: '0px' }}
              data={allDepartments}
              value={department}
              onChange={(value) => handleDepartmentChange(value)}
              placeholder={'Departamento'}
            />

            <DropdownList
              style={{ width: '20%' }}
              value={city}
              data={cities}
              onChange={(value) => setCity(value)}
              placeholder={'Ciudad'}
            />

            <input
              name=""
              type="submit"
              className="add-city-button"
              value="Agregar"
              onClick={() => handleCityAdd()}
            />
          </div>
          <div className="cities-available-text">
            Este servicio se puede realizar en las siguientes ubicaciones:
          </div>
          <div className="cities-container">
            {citiesAvailable.map((ele, idx) => {
              return (
                <div key={idx} className="specific-city-container">
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <div style={{ marginRight: '20px' }}>{ele} </div>
                    <div
                      className="close-city"
                      onClick={() => cityRemover(idx)}
                    >
                      x
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div
            className="cities-available-text"
            style={{ marginTop: '20px', textAlign: 'center' }}
          >
            Restricciones horarias:
          </div>
          <div className="res-container">
            {timeRestrictions.map((ele, idx) => {
              let startHour = miniTimeFunction(ele[0])
              let endHour = miniTimeFunction(ele[1])
              return (
                <div key={idx} className="res-container-2">
                  <div style={{ marginRight: '5px' }}>Disponible de </div>
                  <input
                    name="Second Last"
                    type="number"
                    placeholder="Restricción"
                    className="hour-restriction"
                    max={24}
                    min={0}
                    required
                    onChange={(e) =>
                      timeRestrictionModifier(idx, parseInt(e.target.value), 1)
                    }
                    value={ele[0]}
                  />
                  <div style={{ marginLeft: '5px', marginRight: '7px' }}>
                    a{' '}
                  </div>
                  <input
                    name="Second Last"
                    type="number"
                    placeholder="Restricción"
                    className="hour-restriction"
                    style={{ marginRight: '10px' }}
                    max={24}
                    min={0}
                    required
                    onChange={(e) =>
                      timeRestrictionModifier(idx, parseInt(e.target.value), 2)
                    }
                    value={ele[1]}
                  />
                  {idx !== 0 && (
                    <img
                      alt=""
                      src={RemoveIcon}
                      className="remove-icon-register-service"
                      onClick={() => timeRestrictionRemover(idx)}
                    />
                  )}
                  <div style={{ marginLeft: '10px' }}>
                    {' '}
                    {timeConverter(startHour)} - {timeConverter(endHour)}{' '}
                  </div>
                </div>
              )
            })}

            <input
              name=""
              type="submit"
              className="add-city-button"
              value="Agregar"
              style={{ height: '30px' }}
              onClick={() => {
                setTimeRestrictions((prevTimeRestriction) => [
                  ...prevTimeRestriction,
                  [0, 0],
                ])
              }}
            />
          </div>

          <textarea
            id="textID"
            className="textArea2"
            placeholder="Escriba la descripción del servicio acá..."
            value={description}
            style={{ marginTop: '20px' }}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>

          <div className="parameter-config-title">LISTADO DE ACTIVIDADES</div>

          <div
            className="cities-available-text"
            style={{
              marginBottom: '10px',
              marginTop: '20px',
              textAlign: 'center',
            }}
          >
            Actividades:
          </div>
          <div className="res-container">
            {activities.map((ele, idx) => {
              return (
                <div key={idx} className="res-container-2">
                  <input
                    name="Second Last"
                    type="text"
                    placeholder="Actividad"
                    className="inputSignUp"
                    required
                    onChange={(e) => activityModifier(idx, e.target.value)}
                    value={ele}
                    style={{ marginRight: '10px' }}
                  />
                  {idx !== 0 && (
                    <img
                      alt=""
                      src={RemoveIcon}
                      className="remove-icon-register-service"
                      onClick={() => activityRemover(idx)}
                    />
                  )}
                </div>
              )
            })}
            <input
              name=""
              type="submit"
              className="add-city-button"
              style={{ height: '30px' }}
              value="Agregar"
              onClick={() => {
                setActivities((prevActivity) => [...prevActivity, ''])
              }}
            />
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              width: '100%',
              justifyContent: 'space-around',
              marginBottom: '20px',
            }}
          >
            <input
              name=""
              type="submit"
              className="buttonSignUp"
              value="Editar"
              onClick={() => confirmAlertEditing()}
            />
            {active ? (
              <input
                name=""
                type="submit"
                className="buttonSignUp"
                value="Desactivar"
                onClick={() => confirmAlertDisable()}
              />
            ) : (
              <input
                name=""
                type="submit"
                className="buttonSignUp"
                value="Activar"
                onClick={() => confirmAlertEnable()}
              />
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default withRouter(EditService)
