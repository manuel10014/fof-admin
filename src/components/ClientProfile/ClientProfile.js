import React, { useState, useEffect } from 'react'
import './ClientProfile.css'
import axios from 'axios'
import ServiceViewer from '../ServiceViewer/ServiceViewer'
import { useSelector } from 'react-redux'
import CustomToast from '../custom-toast'
import { toast } from 'react-toastify'
import { confirmAlert } from 'react-confirm-alert' // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css
import { TUNNEL } from '../../assets/constants/url'

const ClientProfile = ({ client, showServices, setShowServices, ...props }) => {
  const [showCreditMenu, setShowCreditMenu] = useState(false)
  const [credits, setCredits] = useState('0')
  const token = useSelector((state) => state.auth.token)

  useEffect(() => {
    setShowCreditMenu(false)
  }, [client])

  const confirmAddCredits = () => {
    confirmAlert({
      title: 'Confirmación de agregar créditos',
      message: `¿Está seguro/a que desea agregar ${formatterPeso.format(
        parseInt(credits),
      )} COP al cliente ?`,
      buttons: [
        {
          label: 'Sí',
          onClick: () => addCredits(),
        },
        {
          label: 'No',
        },
      ],
    })
  }

  const addCredits = async () => {
    if (credits === '0')
      return toast(
        <CustomToast title="¡Tiene que digitar más de 0 créditos!" />,
      )
    try {
      const user = {
        clientID: client._id,
        credits,
        token,
      }
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
      }
      const body = JSON.stringify(user)
      const res = await axios.post(
        `${TUNNEL}/api/users/add-credits`,
        body,
        config,
      )
      setShowCreditMenu(false)
      setCredits('0')
      toast(<CustomToast title={res.data.msg} />)
    } catch (err) {
      toast(
        <CustomToast title="¡No se pudieron añadir los créditos al usuario!" />,
      )
    }
  }

  const formatterPeso = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
  })

  const formatNumber = (num) => {
    return ('' + num).replace(
      /(\d)(?=(?:\d{3})+(?:\.|$))|(\.\d\d?)\d*$/g,
      function (m, s1, s2) {
        return s2 || s1 + '.'
      },
    )
  }
  return !showServices ? (
    <div className="client-profile-container">
      <div className="client-profile-title">DIRECTORIO DE CLIENTES</div>
      <div className="client-profile-info-container">
        <div className="client-total-description">
          <div
            style={{
              color: '#114a9f',
              textTransform: 'uppercase',
              fontSize: '20px',
              fontWeight: 'bold',
              alignSelf: 'center',
              marginTop: '10vh',
            }}
          >
            <span>{client.fullName}</span>
          </div>
          <div className="contact-info-profile">Información de Contacto</div>
          <div className="client-profile-desc">
            <span>{client.idType.toUpperCase()}: </span> {client.idNumber}
          </div>
          <div className="client-profile-desc">
            <span>Dirección: </span> {client.address}
          </div>
          <div className="client-profile-desc">
            <span>Teléfono/Celular:</span> {client.phone}{' '}
          </div>
          <div className="client-profile-desc">
            <span>Departamento:</span> {client.department}{' '}
          </div>
          <div className="client-profile-desc">
            <span>Ciudad:</span> {client.city}{' '}
          </div>
          <div className="client-profile-desc">
            <span>Correo electrónico:</span> {client.email}{' '}
          </div>
          <div className="client-profile-desc">
            <span>Fecha de nacimiento:</span> {client.birthDate}{' '}
          </div>
          <div className="client-profile-desc">
            <span>Créditos:</span>{' '}
            {formatterPeso.format(parseInt(client.credits))} COP
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignSelf: 'center',
            justifyContent: 'center',
            justifyItems: 'center',
          }}
        >
          <button
            className="button-edit"
            onClick={() => setShowServices(true)}
            disabled={showCreditMenu}
          >
            Servicios Programados
          </button>
          <button
            className="button-edit"
            onClick={() => setShowCreditMenu(true)}
            disabled={showCreditMenu}
          >
            Agregar Créditos
          </button>
        </div>
      </div>
      {showCreditMenu && (
        <div className="credit-div">
          <span id="x" onClick={() => setShowCreditMenu(false)}>
            X
          </span>
          <div style={{ display: 'flex', alignSelf: 'center' }}>CRÉDITOS: </div>

          <input
            value={formatNumber(credits)}
            className="input-credits"
            onChange={(event) =>
              setCredits(event.target.value.replace(/\D/, ''))
            }
          />
          <button className="button-credit" onClick={() => confirmAddCredits()}>
            Agregar
          </button>
        </div>
      )}
    </div>
  ) : (
    <ServiceViewer
      isEmployee={false}
      id={client._id}
      isServiceDirectory={false}
      setShowServices={setShowServices}
    />
  )
}

export default ClientProfile
