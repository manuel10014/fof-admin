import React, { useEffect, useState } from "react";
import SearchField from "react-search-field";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import EmployeeProfile from "../EmployeeProfile/EmployeeProfile";
import RegisterEmployee from "../RegisterEmployee/RegisterEmployee";
import Searchable from "react-searchable-dropdown";
import { withRouter } from "react-router-dom";
import "./EmployeeDirectory.css";
import { TUNNEL } from '../../assets/constants/url'

const EmployeeDirectory = (props) => {
  const [allEmployees, setAllEmployees] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [filteredArrayEmployees, setFilteredArrayEmployees] = useState([]);
  const [currentSelectedEmployee, setCurrentSelectedEmployee] = useState(null);
  const [showRegisterEmployee, setShowRegisterEmployee] = useState(false);
  const [showEditEmployee, setShowEditEmployee] = useState(false);
  const [showDropDownList, setShowDropDownList] = useState(true);
  const [showServices, setShowServices] = useState(false);
  const [differentCities, setDifferentCities] = useState([]);
  const [chosenCity, setChosenCity] = useState(null);
  const [currentEmployeeArray, setCurrentEmployeeArray] = useState([]);
  const [showEmployeeRestrictions, setShowEmployeeRestrictions] = useState(
    false
  );
  const userLoaded = useSelector((state) => state.auth.allUserInfo);
  const [stateCounter, setStateCounter] = useState(0);

  useEffect(() => {
    if (stateCounter > 0) {
      if (Object.entries(userLoaded).length === 0) {
        props.history.push("/");
      }
    }
    setStateCounter(stateCounter + 1);
  }, [userLoaded]);

  const getAllEmployees = async () => {
    const config = {
      headers: {
        "content-type": "application/json",
      },
    };
    try {
      const res = await axios.get(
        `${TUNNEL}/api/users/all-employees-different-cities`,
        config
      );
      setAllEmployees(res.data.employees);
      setDifferentCities(res.data.arrayCities);
    } catch (e) {
      console.log(e.response.data);
    }
  };
  useEffect(() => {
    getAllEmployees();
    if (props.location.state) {
      setCurrentSelectedEmployee(props.location.state.serviceInfo.employeeInfo);
    }
  }, []);

  useEffect(() => {
    if (chosenCity) {
      setCurrentEmployeeArray(
        allEmployees.filter((employee) => employee.city === chosenCity)
      );
      setShowDropDownList(false);
    }
  }, [chosenCity]);

  useEffect(() => {
    if (currentEmployeeArray.length > 0) {
      setFilteredArrayEmployees(
        currentEmployeeArray.filter((employee) =>
          employee.fullName.toLowerCase().includes(searchValue)
        )
      );
    }
    if (searchValue === "") {
      setFilteredArrayEmployees([]);
    }
    setShowDropDownList(true);
  }, [searchValue]);

  const showEditMenu = () => {
    setShowRegisterEmployee(false);
    setShowEditEmployee(true);
  };
  return (
    <div className="directory-container">
      <div className="directory-left-container">
        <div className="directory-title"> Búsqueda de empleada</div>
        <div className="searchable-div">
          <div>Filtrar Ciudad:</div>
          <Searchable
            value={chosenCity} //if value is not item of options array, it would be ignored on mount
            placeholder="Ciudad" // by default "Search"
            notFoundText="No se encontraron ciudades" // by default "No result found"
            options={differentCities && differentCities}
            onSelect={(option) => {
              setChosenCity(option); // as example - {value: '', label: 'All'}
            }}
            listMaxHeight={200} //by default 140
          />
        </div>
        <SearchField
          placeholder="Buscar Empleada"
          onChange={(value, event) => setSearchValue(value.toLowerCase())}
        />

        <div
          className="directory-list-container"
          style={{
            display:
              (filteredArrayEmployees.length === 0 || !showDropDownList) &&
              "none",
          }}
        >
          {filteredArrayEmployees.length > 0 &&
            filteredArrayEmployees.map((ele, index) => (
              <div
                key={index}
                className="employee-name-list"
                onClick={() => {
                  setCurrentSelectedEmployee(ele);
                  setShowRegisterEmployee(false);
                  setShowEditEmployee(false);
                  setShowDropDownList(false);
                  setShowServices(false);
                  setShowEmployeeRestrictions(false);
                }}
              >
                {ele.fullName}
              </div>
            ))}
        </div>
        <button
          className="directory-register-employee"
          onClick={() => {
            setCurrentSelectedEmployee(null);
            setShowRegisterEmployee(true);
            setShowEditEmployee(false);
            setShowDropDownList(false);
            setShowServices(false);
            setShowEmployeeRestrictions(false);
          }}
        >
          REGISTRAR EMPLEADA +
        </button>
      </div>
      <div className="directory-right-container">
        {currentSelectedEmployee && !showEditEmployee && (
          <EmployeeProfile
            employee={currentSelectedEmployee}
            showEditMenu={showEditMenu}
            showServices={showServices}
            setShowServices={setShowServices}
            showEmployeeRestrictions={showEmployeeRestrictions}
            setShowEmployeeRestrictions={setShowEmployeeRestrictions}
          />
        )}
        {showRegisterEmployee && <RegisterEmployee />}
        {showEditEmployee && (
          <RegisterEmployee
            editing={true}
            selectedEmployee={currentSelectedEmployee}
            setShowEditEmployee={setShowEditEmployee}
          />
        )}
      </div>
    </div>
  );
};

export default withRouter(EmployeeDirectory);
