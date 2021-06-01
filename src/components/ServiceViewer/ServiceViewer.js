import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { getAllServicesForUser, timeConverter } from './ServiceViewerFcts'
import './ServiceViewer.css'
import plusIcon from '../../assets/images/plusIcon.png'
import editIcon from '../../assets/images/editIcon.png'
import { withRouter } from 'react-router-dom'
import { DropdownList } from 'react-widgets'
import BackArrow from '../../assets/images/backarrow.png'

const ServiceViewer = ({
  id,
  isEmployee,
  isServiceDirectory,
  servicesFromDirectory,
  setShowServices,
  ...props
}) => {
  const [generalUserServices, setGeneralUserServices] = useState(null)
  const [currentFilterOption, setCurrentFilterOption] = useState(null)
  const [filteredArray, setFilteredArray] = useState([])
  const [currentClientName, setCurrentClientName] = useState('')
  const [currentEmployeeName, setCurrentEmployeeName] = useState('')

  const getAllServices = async () => {
    const userServices = await getAllServicesForUser(id, isEmployee)
    setGeneralUserServices(userServices)
  }

  const filterDirectoryServices = () => {
    setGeneralUserServices(servicesFromDirectory)
  }

  useEffect(() => {
    filterDirectoryServices()
  }, [servicesFromDirectory])

  const formatDayFunction = (d) => {
    const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d)
    const mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(d)
    const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d)
    return `${da} de ${mo} de ${ye}`
  }

  const formatDates = (service) => {
    const indexParenthesisStart = service.formatStartDate.indexOf('(')
    const hourStart = service.formatStartDate.substring(
      indexParenthesisStart - 19,
      indexParenthesisStart - 10,
    )
    const indexParenthesisEnd = service.formatEndDate.indexOf('(')
    return [
      hourStart,
      service.formatEndDate.substring(
        indexParenthesisEnd - 19,
        indexParenthesisEnd - 10,
      ),
    ]
  }
  const toDateTime = (secs) => {
    let t = new Date(1969, 11, 31, 19) // Epoch
    t.setSeconds(secs)
    return t
  }

  useEffect(() => {
    if (isServiceDirectory === false) {
      getAllServices()
    } else {
      filterDirectoryServices()
    }
  }, [])

  useEffect(() => {
    if (currentFilterOption && generalUserServices.length > 0) {
      if (currentFilterOption === 'Activos') {
        setFilteredArray(
          generalUserServices.filter((service) => service.state === 'activo'),
        )
      }
      if (currentFilterOption === 'Programados') {
        setFilteredArray(
          generalUserServices.filter(
            (service) => service.state === 'programado',
          ),
        )
      }
      if (currentFilterOption === 'Realizados') {
        setFilteredArray(
          generalUserServices.filter(
            (service) => service.state === 'finalizado',
          ),
        )
      }
    }
  }, [currentFilterOption])

  useEffect(() => {
    if (generalUserServices && generalUserServices.length > 0) {
      setCurrentClientName(generalUserServices[0].clientInfo.fullName)
      setCurrentEmployeeName(generalUserServices[0].employeeInfo.fullName)
    }
  }, [generalUserServices])

  return (
    <div className="service-viewer-container">
      <img
        alt=""
        style={{
          display:
            (isServiceDirectory ||
              (generalUserServices && generalUserServices.length > 0)) &&
            'none',
        }}
        src={BackArrow}
        className="back-arrow"
        onClick={() => setShowServices(false)}
      />
      <div
        style={{
          display:
            (isServiceDirectory ||
              (generalUserServices && generalUserServices.length > 0)) &&
            'none',
        }}
        className="no-service-employee"
      >
        {' '}
        Nunca se le ha agendado un servicio al usuario.
      </div>
      <div
        className="service-viewer-container"
        style={{
          display:
            generalUserServices && generalUserServices.length === 0 && 'none',
        }}
      >
        <div className="service-viewer-title-main">
          SERVICIOS DE{' '}
          <span style={{ textTransform: 'uppercase' }}>
            {' '}
            {isServiceDirectory &&
              servicesFromDirectory &&
              servicesFromDirectory[0].cityService}
          </span>
          <span style={{ textTransform: 'uppercase' }}>
            {!isServiceDirectory && !isEmployee && currentClientName}
          </span>
          <span style={{ textTransform: 'uppercase' }}>
            {!isServiceDirectory && isEmployee && currentEmployeeName}
          </span>
        </div>
        <img
          alt=""
          style={{ display: isServiceDirectory && 'none' }}
          src={BackArrow}
          className="back-arrow"
          onClick={() => setShowServices(false)}
        />
        <div
          style={{
            display: 'flex',
            alignSelf: 'center',
            marginTop: '5%',
            marginBottom: '10px',
          }}
        >
          Seleccione una opción de filtrado:
        </div>
        <DropdownList
          style={{ width: '30%', marginLeft: '35%' }}
          data={['Activos', 'Programados', 'Realizados']}
          value={currentFilterOption}
          onChange={(value) => setCurrentFilterOption(value)}
          placeholder={'Filtrar'}
        />
        <div className="service-viewer-all-services">
          {filteredArray.length > 0 && currentFilterOption ? (
            filteredArray.map((service, index) => {
              let startHour = formatDates(service)[0]
              let endHour = formatDates(service)[1]
              return (
                <div className="service-viewer-service" key={index}>
                  <div className="service-viewer-service-info">
                    <div style={{ marginLeft: '3px' }}>
                      {' '}
                      <span>Fecha:</span>{' '}
                      {formatDayFunction(new Date(service.startDate * 1000))}
                    </div>
                    <div style={{ marginLeft: '3px' }}>
                      {' '}
                      <span> Hora:</span>{' '}
                      {timeConverter(startHour) +
                        ' - ' +
                        timeConverter(endHour)}
                    </div>
                    {(!isEmployee || isServiceDirectory) && (
                      <div
                        style={{ textTransform: 'capitalize', display: 'flex' }}
                      >
                        <span> Empleada: </span>
                        <div
                          className="employee-div"
                          onClick={() =>
                            props.history.push({
                              pathname: '/employeedirectory',
                              state: {
                                serviceInfo: service,
                              },
                            })
                          }
                        >
                          {' '}
                          {service.employeeInfo.fullName}
                        </div>
                      </div>
                    )}
                    {(isEmployee || isServiceDirectory) && (
                      <div
                        style={{ textTransform: 'capitalize', display: 'flex' }}
                      >
                        <span> Cliente: </span>
                        <div
                          className="client-div"
                          onClick={() =>
                            props.history.push({
                              pathname: '/clientdirectory',
                              state: { serviceInfo: service },
                            })
                          }
                        >
                          {' '}
                          {service.clientInfo.fullName}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="service-viewer-service-green" key={index}>
                    <div className="service-viewer-title">
                      {' '}
                      {service.nameService}{' '}
                    </div>
                    <div className="service-viewer-icon-container">
                      <img
                        alt="Ver más"
                        src={plusIcon}
                        onClick={() =>
                          props.history.push({
                            pathname: '/specificservice',
                            state: { serviceInfo: service },
                          })
                        }
                        id="plus-icon"
                      />
                    </div>
                  </div>
                </div>
              )
            })
          ) : filteredArray.length === 0 &&
            currentFilterOption &&
            !isServiceDirectory ? (
            <div style={{ display: 'flex', alignSelf: 'center' }}>
              {' '}
              La persona no tiene servicios {currentFilterOption.toLowerCase()}.{' '}
            </div>
          ) : (
            filteredArray.length === 0 &&
            currentFilterOption &&
            isServiceDirectory && (
              <div style={{ display: 'flex', alignSelf: 'center' }}>
                {' '}
                No hay servicios {currentFilterOption.toLowerCase()}.{' '}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  )
}

export default withRouter(ServiceViewer)
