import React, { useEffect, useState } from "react";
import "./AdminDirectory.css";
import SearchField from "react-search-field";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import Searchable from "react-searchable-dropdown";
import RegisterAdmin from "../RegisterAdmin/RegisterAdmin";
import AdminProfile from "../AdminProfile/AdminProfile";
import { withRouter } from "react-router-dom";
import { TUNNEL } from "../../assets/constants/url";

const AdminDirectory = (props) => {
  const [allAdmins, setAllAdmins] = useState([]);
  const [differentCities, setDifferentCities] = useState([]);
  const [chosenCity, setChosenCity] = useState(null);
  const [showDropDownList, setShowDropDownList] = useState(true);
  const [currentAdminArray, setCurrentAdminArray] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [filteredArrayAdmins, setFilteredArrayAdmins] = useState([]);
  const [showRegisterAdmin, setShowRegisterAdmin] = useState(false);
  const [showEditAdmin, setShowEditAdmin] = useState(false);
  const [currentSelectedAdmin, setCurrentSelectedAdmin] = useState(null);
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

  const getAllAdmins = async () => {
    const config = {
      headers: {
        "content-type": "application/json",
      },
    };
    try {
      const res = await axios.get(
        `${TUNNEL}/api/admin/all-admins-different-cities`,
        config
      );
      setAllAdmins(res.data.admins);
      setDifferentCities(res.data.arrayCities);
    } catch (e) {
      console.log(e.response.data);
    }
  };
  useEffect(() => {
    getAllAdmins();
  }, []);

  useEffect(() => {
    if (chosenCity) {
      setCurrentAdminArray(
        allAdmins.filter((admin) => admin.city === chosenCity.value)
      );
      setShowDropDownList(false);
    }
  }, [chosenCity]);

  useEffect(() => {
    if (currentAdminArray.length > 0) {
      setFilteredArrayAdmins(
        currentAdminArray.filter((admin) =>
          admin.fullName.toLowerCase().includes(searchValue)
        )
      );
    }
    if (searchValue === "") {
      setFilteredArrayAdmins([]);
    }
    setShowDropDownList(true);
  }, [searchValue]);

  const showEditMenu = () => {
    setShowRegisterAdmin(false);
    setShowEditAdmin(true);
  };

  return (
    <div className="directory-container">
      <div className="directory-left-container">
        <div className="directory-title"> Búsqueda de administrador</div>
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
          placeholder="Buscar Administrador"
          onChange={(value, event) => setSearchValue(value.toLowerCase())}
        />

        <div
          className="directory-list-container"
          style={{
            display:
              (filteredArrayAdmins.length === 0 || !showDropDownList) && "none",
          }}
        >
          {filteredArrayAdmins.length > 0 &&
            filteredArrayAdmins.map((ele, index) => (
              <div
                key={index}
                className="employee-name-list"
                onClick={() => {
                  setCurrentSelectedAdmin(ele);
                  setShowRegisterAdmin(false);
                  setShowEditAdmin(false);
                  setShowDropDownList(false);
                }}
              >
                {ele.fullName}
              </div>
            ))}
        </div>
        <button
          className="directory-register-employee"
          onClick={() => {
            setCurrentSelectedAdmin(null);
            setShowRegisterAdmin(true);
            setShowEditAdmin(false);
            setShowDropDownList(false);
          }}
        >
          REGISTRAR ADMINISTRADOR +
        </button>
      </div>
      <div className="directory-right-container">
        {currentSelectedAdmin && !showEditAdmin && (
          <AdminProfile
            admin={currentSelectedAdmin}
            showEditMenu={showEditMenu}
          />
        )}
        {showRegisterAdmin && <RegisterAdmin />}
        {showEditAdmin && (
          <RegisterAdmin
            setShowEditAdmin={setShowEditAdmin}
            editing={true}
            selectedAdmin={currentSelectedAdmin}
          />
        )}
      </div>
    </div>
  );
};

export default withRouter(AdminDirectory);
