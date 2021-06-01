import React, { useEffect, useState } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import axios from 'axios'
import ServiceViewer from '../ServiceViewer/ServiceViewer'
import Chat from '../Chat/Chat'
import ActivityList from '../ActivityList/ActivityList'
import { useDispatch, useSelector } from 'react-redux'
import './Agenda.css'
import { withRouter } from 'react-router-dom'
import { TUNNEL } from '../../assets/constants/url'

moment.locale('es')
const localizer = momentLocalizer(moment)

const Agenda = (props) => {
  const userLoaded = useSelector((state) => state.auth.allUserInfo)
  const [selectedCalendarDate, setSelectedCalendarDate] = useState('')
  const [selectedDateTime, setSelectedDateTime] = useState(0)
  const [filteredServicesByTime, setFilteredServicesByTime] = useState([])
  const [showServiceViewer, setShowServiceViewer] = useState(true)
  const [allUserServices, setAllUserServices] = useState([])
  const [userServiceEvents, setUserServiceEvents] = useState([])
  const [currentSelectedEvent, setCurrentSelectedEvent] = useState([])
  const [stateCounter, setStateCounter] = useState(0)

  useEffect(() => {
    if (stateCounter > 0) {
      if (Object.entries(userLoaded).length === 0) {
        props.history.push('/')
      }
    }
    setStateCounter(stateCounter + 1)
  }, [userLoaded])

  const formatDayFunction = (d) => {
    const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d)
    const mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(d)
    const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d)
    return `${da} de ${mo} de ${ye}`
  }

  const toDateTime = (secs) => {
    var t = new Date(1969, 11, 31, 19) // Epoch
    t.setSeconds(secs)
    return t
  }

  const handleSelectedDate = (e) => {
    const formatDate = formatDayFunction(e)
    setSelectedCalendarDate(formatDate)
    setSelectedDateTime(e.getTime() / 1000)
  }

  useEffect(() => {
    if (allUserServices.length > 0) {
      setFilteredServicesByTime(
        allUserServices.filter(
          (service) =>
            service.startDate >= selectedDateTime &&
            service.endDate < selectedDateTime + 24 * 3600,
        ),
      )
      let events = allUserServices.map((service) => {
        let transformedStartDate = toDateTime(service.startDate)
        let transformedEndDate = toDateTime(service.endDate)

        return {
          start: transformedStartDate,
          end: transformedEndDate,
          state: service.state,
          title: service.nameService,
          isActive: service.active,
          eventID: service._id,
        }
      })
      setUserServiceEvents(events)
    }
  }, [allUserServices])

  useEffect(() => {
    setShowServiceViewer(false)
    setFilteredServicesByTime(
      allUserServices.filter(
        (service) =>
          service.startDate >= selectedDateTime &&
          service.endDate < selectedDateTime + 24 * 3600,
      ),
    )
  }, [selectedDateTime])

  useEffect(() => {
    setShowServiceViewer(true)
  }, [filteredServicesByTime])

  const getAllServices = async () => {
    const config = {
      headers: {
        'content-type': 'application/json',
      },
    }
    try {
      const res = await axios.get(
        `${TUNNEL}/api/services/all-services-different-cities`,
        config,
      )
      setAllUserServices(res.data.services)
      //setDifferentCities(res.data.arrayCities);
    } catch (e) {
      console.log(e.response.data)
    }
  }

  useEffect(() => {
    const d = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate(),
    )
    const formatDate = formatDayFunction(d)
    setSelectedCalendarDate(formatDate)
    setSelectedDateTime(d.getTime() / 1000)
    getAllServices()
  }, [])

  useEffect(() => {
    setShowServiceViewer(true)
  }, [currentSelectedEvent])

  useEffect(() => {}, [filteredServicesByTime])

  return (
    <div className="signedInContainer">
      <div className="calendarContainer">
        <div className="bckg1"></div>
        <div className="title-signedin">Mis Servicios</div>

        <div className="calendar">
          <Calendar
            localizer={localizer}
            events={userServiceEvents}
            step={60}
            startAccessor="start"
            endAccessor="end"
            messages={{
              next: 'sig',
              previous: 'ant',
              today: 'Hoy',
              month: 'Mes',
              week: 'Semana',
              day: 'Día',
            }}
            //view={"month"}
            eventPropGetter={(event, start, end, isSelected) => {
              let newStyle = {
                backgroundColor: 'red',
                color: 'black',
                borderRadius: '0px',
                borderRight: '1px solid black',
                borderLeft: '1px solid black',
                borderTop: '1px solid black',
              }
              if (event.state === 'activo') {
                newStyle.backgroundColor = 'green'
              }
              if (event.state === 'finalizado') {
                newStyle.backgroundColor = 'red'
              }
              if (event.state === 'programado') {
                newStyle.backgroundColor = 'yellow'
              }
              return {
                className: '',
                style: newStyle,
              }
            }}
            // onSelectSlot={(e) => console.log(e, "slot")}
            //onSelectEvent={(e) => console.log("nada")}
            onNavigate={(e) => handleSelectedDate(e)}
            onView={(e) => {
              if (e === 'day') {
              }
            }}
          />
        </div>
        {/* <div className="calendar-indicator-container">
          <div>Realizado</div>
          <div>Programado</div>
        </div> */}
      </div>

      <div className="right-container-signedin">
        <div className="date-title-signedin-main">{selectedCalendarDate}</div>
        {allUserServices.length > 0 &&
          selectedDateTime &&
          showServiceViewer && (
            <ServiceViewer
              isEmployee={false}
              isServiceDirectory={true}
              servicesFromDirectory={
                filteredServicesByTime.length > 0 && filteredServicesByTime
              }
            />
          )}
      </div>
    </div>
  )
}

export default withRouter(Agenda)
