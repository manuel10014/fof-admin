import React, { useState, useEffect } from 'react'
import { withRouter } from 'react-router-dom'
import "./Contacts.css"
import { TUNNEL } from '../../assets/constants/url'
import axios from "axios";
import Searchable from "react-searchable-dropdown";
import SearchField from "react-search-field";
import ContactProfile from "../ContactProfile/ContactProfile";
import RegisterContact from "../RegisterContact/RegisterContact";

const Contact=() => {
    const [allContacts, setAllContacts] = useState([]);
    const [differentCities, setDifferentCities] = useState([]);    
    const [chosenCity, setChosenCity] = useState(null);
    const [showDropDownList, setShowDropDownList] = useState(true);
    const [showRegisterContact, setShowRegisterContact] = useState(false);
    const [showEditContact, setShowEditContact] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [filteredArrayContacts, setFilteredArraycontacts] = useState([]);
    const [currentSelectedContacts, setCurrentSelectedContacts] = useState(null);
    const [currentContactsArray, setCurrentContactsArray] = useState([]);

    const getAllContacts = async () => {
        const config = {
          headers: {
            "content-type": "application/json",
          },
        };
        try {
          const res = await axios.get(
            `${TUNNEL}/api/users/all-contacts-different-cities`,
            config
          );
          console.log(res.data)
          setAllContacts(res.data.contacts);
          setDifferentCities(res.data.arrayCities);
        } catch (e) {
          console.log(e.response.data);
        }
      };

      useEffect(() => {
        getAllContacts();
      }, []);

      useEffect(() => {
        if (chosenCity) {
          setCurrentContactsArray(
            allContacts.filter((contacts) => contacts.city === chosenCity.value)
          );
          setShowDropDownList(false);
        }
      }, [chosenCity]);

      
    useEffect(() => {
        if (currentContactsArray.length > 0) {
            setFilteredArraycontacts(
            currentContactsArray.filter((contacts) =>
            contacts.fullName.toLowerCase().includes(searchValue)
            )
        );
        }
        if (searchValue === "") {
           setFilteredArraycontacts([]);
        }
        setShowDropDownList(true);
    }, [searchValue]); 

      const showEditMenu = () => {
        setShowRegisterContact(false);
        setShowEditContact(true);
      };

    return(
        <div className="directory-container">
            <div className="directory-left-container">
                <div className="directory-title">Contactos</div>
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
                placeholder="Buscar Contatos"
                onChange={(value, event) => setSearchValue(value.toLowerCase())}
                />
                <div className="directory-list-container"
                style={{display:
                    (filteredArrayContacts.length === 0 || !showDropDownList) && "none",
                }}>
                   {filteredArrayContacts.length > 0 &&
                    filteredArrayContacts.map((ele, index) => (
                    <div
                      key={index}
                      className="employee-name-list"
                      onClick={() => {
                        setCurrentSelectedContacts(ele);
                        setShowRegisterContact(false);
                        setShowEditContact(false);
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
                    setCurrentSelectedContacts(null);
                    setShowRegisterContact(true);
                    setShowEditContact(false);
                    setShowDropDownList(false);
                }}
                >
                AGREGAR UN CONTACTO +
                </button>
            </div>
            <div className="directory-right-container">
                {currentSelectedContacts && !showEditContact && (
                <ContactProfile
                    contact={currentSelectedContacts}
                    showEditMenu={showEditMenu}
                />
            )}
            {showRegisterContact && <RegisterContact />}
            {showEditContact && (
                <RegisterContact
                    setShowEditContact={setShowEditContact}
                    editing={true}
                    selectedContact={currentSelectedContacts}
                />
            )}
            </div>
        </div>
    )
}

export default withRouter(Contact);