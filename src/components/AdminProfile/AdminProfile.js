import React from "react";

const AdminProfile = ({ admin, showEditMenu, ...props }) => {
  return (
    <div className="client-profile-container">
      <div className="client-profile-title">DIRECTORIO DE ADMINISTRADORES</div>
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
            <span>{admin.fullName}</span>
          </div>
          <div className="contact-info-profile">Información de Contacto</div>
          <div className="client-profile-desc">
            <span>CC: </span> {admin.citizenID}
          </div>
          <div className="client-profile-desc">
            <span>Teléfono/Celular:</span> {admin.phone}{" "}
          </div>
          <div className="client-profile-desc">
            <span>Departamento:</span> {admin.department}{" "}
          </div>
          <div className="client-profile-desc">
            <span>Ciudad:</span> {admin.city}{" "}
          </div>
          <div className="client-profile-desc">
            <span>Correo electrónico:</span> {admin.email}{" "}
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
            Editar Administrador
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
