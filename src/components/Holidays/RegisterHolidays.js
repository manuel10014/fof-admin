import React, { useState, useEffect } from "react";
import "./RegisterHolidays.css";
import axios from "axios";
import CustomToast from "../custom-toast";
import { toast } from "react-toastify";
import { TUNNEL } from '../../assets/constants/url'
import { DropdownList } from 'react-widgets'
import { confirmAlert } from 'react-confirm-alert' // Import
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const RegisterHolidays = (
    editing,
    setShowEditHolidays,
    ...props
) =>{
    const [year, setYear] = useState((new Date ()).getFullYear())
    const [holidays,setHolidays] = useState([])
    const [dayToBeHoliday, setDayToBeHoliday] = useState(new Date());

    const handleYearChange = (value) => {
        setYear(value);
    };

    useEffect(() => {
        if (editing === true) {
          const {
            year,
            holidays
          } = selectedYear;
          setYear(year);
          setHolidays(holidays)
        }
      }, [editing]);
    
    const register = async () => {
        const holiday = {
            year: year,
            holidays: holiday
        };
        try {
            const config = {
                headers: {
                    "Content-Type": "application/json",
                },
            };
            const body = JSON.stringify(holiday);
            const res = await axios.post(
            `${TUNNEL}/api/admin/holidays`,
            body,
            config
            );
            toast(<CustomToast title="¡Registro de festivo(s)!" />);
        } catch (err) {
            toast(<CustomToast title={err.response.data.errors[0].msg} />);
        }
    };

    const editContact = async () => {
        const config = {
            headers: {
            "Content-Type": "application/json",
            },
        };
        let errors = 0;
        try{
            const holiday = {
                year: year,
                holidays: holiday
            };
            const body = JSON.stringify(holiday);
            if (errors === 0) {
                const resServer = await axios.post(
                `${TUNNEL}/api/admin/holidayt-edit`,
                body,
                config
            );
            toast(<CustomToast title={resServer.data} />);
            }
        } catch (err) {
            toast(<CustomToast title={err.response.data.errors[0].msg} />);
        }
    };

    const confirmAlertEditing = () => {
        confirmAlert({
            title: 'Confirmación de edición',
            message: `¿Está seguro/a que desea editar el festivo?`,
            buttons: [
            {
                label: 'Sí',
                onClick: () => editContact(),
            },
            {
                label: 'No',
            },
            ],
        })
    }

    const confirmAlertRegister = () => {
        confirmAlert({
            title: 'Confirmación de registro',
            message: `¿Está seguro/a que desea registrar un festivo?`,
            buttons: [
            {
                label: 'Sí',
                onClick: () => register(),
            },
            {
                label: 'No',
            },
            ],
        })
    }

    return(
        <div
            style={{
            display: "flex",
            overflow: "hidden",
            alignItems: "center",
            }}
        >
            <div className="formDiv">
              <div className="divRow"></div>
              <DatePicker
                selected={dayToBeHoliday}
                onChange={(date) => setDayToBeHoliday(date)}
              />
            </div>
        </div>
    )
}

export default RegisterHolidays;
