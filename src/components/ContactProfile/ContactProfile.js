import React from "react";
import "react-datepicker/dist/react-datepicker.css";
import "rc-time-picker/assets/index.css";
import "./ContactProfile.css";


const ContactProfile = ({contact, showEditMenu, ...props}) => {
  return (
    <div className="client-profile-container">
      <div className="client-profile-title">DIRECTORIO DE CONTACTOS</div>
      <div className="client-profile-info-container">
        <div className="client-total-description">
          <div
            style={{
              color: "#114a9f",
              textTransform: "uppercase",
              fontSize: "20px",
              fontWeight: "bold",
              alignSelf: "center",
              marginTop: "10vh",
            }}
          >
            <span>{contact.fullName}</span>
          </div>
          <div className="contact-info-profile">Información de Contacto</div>
          <div className="client-profile-desc">
            <span>Cargo: </span> {contact.position}
          </div>
          <div className="client-profile-desc">
            <span>Teléfono/Celular:</span> {contact.phone}{" "}
          </div>
          <div className="client-profile-desc">
            <span>Departamento:</span> {contact.department}{" "}
          </div>
          <div className="client-profile-desc">
            <span>Ciudad:</span> {contact.city}{" "}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignSelf: "center",
            justifyContent: "center",
            justifyItems: "center",
          }}
        >
          <button className="button-edit" onClick={showEditMenu}>
            Editar contacto
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactProfile;
