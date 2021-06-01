import React, { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import sendMessageIcon from '../../assets/images//sendMessageIcon.png'
import LoaderIcon from 'react-loader-icon'
import './Chat.css'
import { TUNNEL } from '../../assets/constants/url'
import { timeConverter } from '../ServiceViewer/ServiceViewerFcts'

const Chat = ({
  profileMaid,
  chat,
  serviceAddress,
  userInfo,
  chatEnabled,
  isActive,
  employeeID,
  serviceName,
  formatStartDate,
  formatEndDate,
  serviceID,
  ...props
}) => {
  const [profilePic, setProfilePic] = useState(null)
  const [maidInfo, setMaidInfo] = useState(null)
  const [startHour, setStartHour] = useState('00:00:00')
  const [endHour, setEndHour] = useState('00:00:00')
  const [msg, setMsg] = useState('')
  const messageEl = useRef(null)
  const dummyDiv = useRef()
  useEffect(() => {
    if (messageEl) {
      messageEl.current.addEventListener('DOMNodeInserted', (event) => {
        const { currentTarget: target } = event
        target.scroll({ top: target.scrollHeight, behavior: 'smooth' })
      })
    }
    scrollToBottom()
  }, [])

  const scrollToBottom = () => {
    dummyDiv.current.scrollIntoView()
  }
  const sendMessage = async () => {
    if (chatEnabled) {
      const msgInfo = {
        msg,
        userID: userInfo._id,
        employeeID,
        serviceID,
        to: employeeID,
      }
      try {
        const config = {
          headers: {
            'Content-Type': 'application/json',
          },
        }
        const body = JSON.stringify(msgInfo)
        const res = await axios.post(`${TUNNEL}/api/chat/`, body, config)
        setMsg('')
      } catch (err) {
        console.log(err)
      }
    }
  }
  const getMaidProfilePic = async () => {
    const config = {
      headers: {
        'content-type': 'application/json',
      },
    }
    try {
      const res = await axios.get(
        `${TUNNEL}/api/files/employee-img/${employeeID}`,
        config,
      )
      setProfilePic(res.config.url)
    } catch (e) {
      console.log(e)
    }
  }

  const getMaidInfo = async () => {
    const config = {
      headers: {
        'content-type': 'application/json',
      },
    }
    try {
      const res = await axios.get(
        `${TUNNEL}/api/users/employee-info/${employeeID}`,
        config,
      )
      setMaidInfo(res.data)
    } catch (e) {
      console.log(e)
    }
  }
  const formatDates = () => {
    const indexParenthesisStart = formatStartDate.indexOf('(')
    const hourStart = formatStartDate.substring(
      indexParenthesisStart - 19,
      indexParenthesisStart - 10,
    )
    const indexParenthesisEnd = formatEndDate.indexOf('(')
    setStartHour(hourStart)
    setEndHour(
      formatEndDate.substring(
        indexParenthesisEnd - 19,
        indexParenthesisEnd - 10,
      ),
    )
  }
  useEffect(() => {
    formatDates()
    setProfilePic(null)
    getMaidProfilePic()
    getMaidInfo()
  }, [employeeID])

  return (
    <div className="chat-container-signedin">
      <div className="chat-service-information">
        {profilePic ? (
          <img
            style={{ borderRadius: '50%', height: '130px' }}
            src={profilePic && profilePic}
            alt=""
          />
        ) : (
          <div className="svg-class">
            <LoaderIcon type={'spin'} size={50} />
          </div>
        )}

        <div className="chat-information-box">
          {/*props acá*/}
          <div className="other-info">
            <span>Empleada:</span>{' '}
            {maidInfo &&
              maidInfo.firstName +
                ' ' +
                maidInfo.lastName +
                ' ' +
                maidInfo.secondLastName}
          </div>
          <div className="fullService">
            <div>{serviceName} </div>
          </div>
          <div className="other-info">
            <span>Dirección del servicio:</span> {serviceAddress}
          </div>
          <div className="other-info">
            <span style={{ fontStyle: 'italic' }}>
              Horario:{' '}
              {startHour &&
                endHour &&
                timeConverter(startHour) + ' - ' + timeConverter(endHour)}
            </span>
          </div>
          <div className="other-info" style={{ textTransform: 'capitalize' }}>
            <span>Cliente: </span> {userInfo.fullName}
          </div>
        </div>
      </div>

      <div className="chat-container">
        <div className="chat-body">
          <div className="chat-area" ref={messageEl}>
            {chat.length > 0 &&
              chat.map((message, index) => {
                return message.to === userInfo._id ? (
                  <div key={index} className="received-message">
                    <div className="specific-message-content">
                      {' '}
                      {message.msg}{' '}
                    </div>
                    <div className="specific-message-time">
                      {' '}
                      {timeConverter(message.timeSent)}{' '}
                    </div>
                  </div>
                ) : (
                  <div key={index} className="sent-message">
                    <div className="specific-message-content">
                      {' '}
                      {message.msg}{' '}
                    </div>
                    <div className="specific-message-time">
                      {' '}
                      {timeConverter(message.timeSent)}{' '}
                    </div>
                  </div>
                )
              })}
            <div style={{ float: 'left', clear: 'both' }} ref={dummyDiv}></div>
          </div>

          <div className="write-area">
            <textarea
              id="textID"
              className="textArea"
              rows="1"
              placeholder={
                chatEnabled ? 'Escriba su mensaje acá...' : 'Chat deshabilitado'
              }
              disabled={!chatEnabled}
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
            ></textarea>
            <div className="img-dummy-chat" onClick={() => sendMessage()}>
              <img src={sendMessageIcon} alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chat
