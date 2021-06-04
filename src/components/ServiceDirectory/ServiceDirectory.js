import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import axios from "axios";
import Searchable from "react-searchable-dropdown";
import ServiceViewer from "../ServiceViewer/ServiceViewer";
import "./ServiceDirectory.css";
import { useDispatch, useSelector } from "react-redux";
import { TUNNEL } from '../../assets/constants/url'

const ServiceDirectory = (props) => {
  const [allServices, setAllServices] = useState([]);
  const [differentCities, setDifferentCities] = useState([]);
  const [chosenCity, setChosenCity] = useState(null);
  const [currentServiceArray, setCurrentServiceArray] = useState([]);
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

  const getAllServices = async () => {
    const config = {
      headers: {
        "content-type": "application/json",
      },
    };
    try {
      const res = await axios.get(
        `${TUNNEL}/api/services/all-services-different-cities`,
        config
      );
      setAllServices(res.data.services);
      setDifferentCities(res.data.arrayCities);
    } catch (e) {
      console.log(e.response.data);
    }
  };
  useEffect(() => {
    getAllServices();
  }, []);

  useEffect(() => {
    if (chosenCity) {
      setCurrentServiceArray(
        allServices.filter(
          (service) => service.cityService === chosenCity
        )
      );
    }
  }, [chosenCity]);

  return (
    <div className="directory-container">
      <div className="directory-left-container">
        <div className="directory-title"> Búsqueda de servicios</div>
        <div className="searchable-div">
          <div>Filtrar Ciudad:</div>
          <Searchable
            value={chosenCity} //if value is not item of options array, it would be ignored on mount
            placeholder="Ciudad" // by default "Search"
            notFoundText="No se encontraron ciudades" // by default "No result found"
            options={differentCities}
            onSelect={(option) => {
              setChosenCity(option); // as example - {value: '', label: 'All'}
            }}
            listMaxHeight={200} //by default 140
          />
        </div>
      </div>
      <div className="directory-right-container">
        {currentServiceArray.length > 0 && (
          <ServiceViewer
            isEmployee={false}
            isServiceDirectory={true}
            servicesFromDirectory={currentServiceArray}
          />
        )}
      </div>
    </div>
  );
};

export default withRouter(ServiceDirectory);
