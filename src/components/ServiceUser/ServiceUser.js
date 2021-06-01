import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router-dom'
import Chat from '../Chat/Chat'
import ActivityList from '../ActivityList/ActivityList'
import './ServiceUser.css'

const ServiceUser = (props) => {
  const [serviceInfo, setServiceInfo] = useState({})
  const [selectedEventActive, setSelectedEventActive] = useState([])
  const [eventStillToCome, setEventStillToCome] = useState(false)

  const toDateTime = (secs) => {
    var t = new Date(1969, 11, 31, 19) // Epoch
    t.setSeconds(secs)
    return t
  }
  const formatDayFunction = (d) => {
    const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d)
    const mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(d)
    const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d)
    return `${da} de ${mo} de ${ye}`
  }

  useEffect(() => {
    if (props.location.state) {
      setServiceInfo(props.location.state.serviceInfo)
    }
  }, [])

  useEffect(() => {
    if (Object.entries(serviceInfo).length > 0) {
      let isActive =
        new Date() > toDateTime(serviceInfo.startDate) &&
        new Date() < toDateTime(serviceInfo.endDate)
      let evToCome = toDateTime(serviceInfo.startDate) > new Date()

      setEventStillToCome(evToCome)
      setSelectedEventActive(isActive)
    }
  }, [serviceInfo])

  return (
    <div className="service-user-container">
      <div className="date-title-signedin">
        {serviceInfo.startDate &&
          formatDayFunction(new Date(serviceInfo.startDate * 1000))}
      </div>
      {Object.entries(serviceInfo).length > 0 && (
        <div className="chat-and-activity-container">
          <Chat
            chat={serviceInfo.chat}
            serviceAddress={serviceInfo.serviceAddress}
            userInfo={serviceInfo.clientInfo}
            chatEnabled={false}
            isActive={selectedEventActive}
            employeeID={serviceInfo.employee}
            serviceID={serviceInfo._id}
            serviceName={serviceInfo.nameService}
            formatStartDate={serviceInfo.formatStartDate.toString()}
            formatEndDate={serviceInfo.formatEndDate.toString()}
          />
          <ActivityList
            isActive={selectedEventActive}
            eventStillToCome={serviceInfo.state === 'programado' ? true : false}
            allActivities={serviceInfo.activitiesDone}
            serviceID={serviceInfo._id}
          />
        </div>
      )}
    </div>
  )
}

export default withRouter(ServiceUser)
