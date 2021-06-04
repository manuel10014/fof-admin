import React, { useEffect, useState } from "react";
import SearchField from "react-search-field";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import Searchable from "react-searchable-dropdown";
import ClientProfile from "../ClientProfile/ClientProfile";
import { withRouter } from "react-router-dom";
import { TUNNEL } from '../../assets/constants/url'

import "./ClientDirectory.css";
const ClientDirectory = (props) => {
  const [allClients, setAllClients] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [filteredArrayClients, setFilteredArrayClients] = useState([]);
  const [currentSelectedClient, setCurrentSelectedClient] = useState(null);
  const [showDropDownList, setShowDropDownList] = useState(true);
  const [showServices, setShowServices] = useState(false);
  const [differentCities, setDifferentCities] = useState([]);
  const [chosenCity, setChosenCity] = useState(null);
  const [currentClientArray, setCurrentClientArray] = useState([]);
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

  const getAllClients = async () => {
    const config = {
      headers: {
        "content-type": "application/json",
      },
    };
    try {
      const res = await axios.get(
        `${TUNNEL}/api/users/all-clients-different-cities`,
        config
      );
      setAllClients(res.data.clients);
      setDifferentCities(res.data.arrayCities);
    } catch (e) {
      console.log(e.response.data);
    }
  };
  useEffect(() => {
    getAllClients();
    if (props.location.state) {
      setCurrentSelectedClient(props.location.state.serviceInfo.clientInfo);
    }
  }, []);

  useEffect(() => {
    if (chosenCity) {
      setCurrentClientArray(
        allClients.filter((client) => client.city === chosenCity)
      );
      setShowDropDownList(false);
    }
  }, [chosenCity]);
  useEffect(() => {
    if (currentClientArray.length > 0) {
      setFilteredArrayClients(
        currentClientArray.filter((client) =>
          client.fullName.toLowerCase().includes(searchValue)
        )
      );
    }
    if (searchValue === "") {
      setFilteredArrayClients([]);
    }
    setShowDropDownList(true);
  }, [searchValue]);

  return (
    <div className="directory-container">
      <div className="directory-left-container">
        <div className="directory-title-client"> Búsqueda de clientes</div>
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
          placeholder="Buscar Cliente"
          onChange={(value, event) => setSearchValue(value.toLowerCase())}
        />
        <div
          className="directory-list-container"
          style={{
            display:
              (filteredArrayClients.length === 0 || !showDropDownList) &&
              "none",
          }}
        >
          {filteredArrayClients.length > 0 &&
            filteredArrayClients.map((ele, index) => (
              <div
                key={index}
                className="client-name-list"
                onClick={() => {
                  setCurrentSelectedClient(ele);
                  setShowDropDownList(false);
                  setShowServices(false);
                }}
              >
                {ele.fullName}
              </div>
            ))}
        </div>
      </div>
      <div className="directory-right-container">
        {currentSelectedClient && (
          <ClientProfile
            client={currentSelectedClient}
            showServices={showServices}
            setShowServices={setShowServices}
          />
        )}
      </div>
    </div>
  );
};

export default withRouter(ClientDirectory);
