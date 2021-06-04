import React, { useState } from "react";
import "./Tools.css";
import Searchable from "react-searchable-dropdown";
import RegisterHolidays from "../Holidays/RegisterHolidays";

const Tools = () => {
  const [chosenTool , setChosenTool] = useState(null)
  const differentTools = [{value: "Agregar festivos", label: "Agregar festivos"}];
  const [showRegisterHolidays,setShowRegisterHolidays] = useState(false)  
  const [showEditHolidays,setShowEditHolidays] = useState(false)
  return (
    <div className="directory-container">
      <div className="directory-left-container">
      <div className="directory-title">Herramientas</div>
        <div className="searchable-div">
        <div>Filtrar herramientas:</div>
          <Searchable
          value={chosenTool} //if value is not item of options array, it would be ignored on mount
          placeholder="Herramientas" // by default "Search"
          notFoundText="No se encontraron herramientas" // by default "No result found"
          options={differentTools}
          onSelect={(option) => {
              setChosenTool(option); // as example - {value: '', label: 'All'}
          }}
          listMaxHeight={200} //by default 140
        />
        </div>
        {chosenTool === "Agregar festivos" ? 
          <button
            className="directory-register-employee"
            onClick={() => {
              setShowRegisterHolidays(true)
            }}
          >
          AGREGAR UN FESTIVO
          </button>
          :
          <div></div>
      }
      </div>
      <div className="directory-right-container">
        {showRegisterHolidays && <RegisterHolidays/>}
        {showEditHolidays && (
          <RegisterHolidays
              setShowEditHolidays={setShowEditHolidays}
              editing={true}
          />
        )}
      </div>
    </div>
  );
};

export default Tools;
