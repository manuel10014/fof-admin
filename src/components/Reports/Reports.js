import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Reports.css";
import { Chart } from "react-google-charts";
import plusIcon from "../../assets/images/plusIcon.png";
import minusIcon from "../../assets/images/minusIcon.png";
import { useDispatch, useSelector } from "react-redux";
import { withRouter } from "react-router-dom";
import { TUNNEL } from '../../assets/constants/url'

const Reports = (props) => {
  const [dailyPieChartStats, setDailyPieChartStats] = useState(null);
  const [serviceStatesToday, setServiceStatesToday] = useState({});
  const [numberOfServicesPerCity, setNumberOfServicesPerCity] = useState(null);
  const [mostWantedServiceRegion, setMostWantedServiceRegion] = useState(null);
  const [topRatedEmployees, setTopRatedEmployees] = useState(null);
  const [mostWantedEmployees, setMostWantedEmployees] = useState(null);
  const [rowsRatedEmployees, setRowsRatedEmployees] = useState(null);
  const [rowsWantedEmployees, setRowsWantedEmployees] = useState(null);
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
  const getStatsTodayPieChart = async () => {
    const config = {
      headers: {
        "content-type": "application/json",
      },
    };
    try {
      const res = await axios.get(
        `${TUNNEL}/api/stats/total-services-today-per-city`,
        config
      );
      console.log(res.data, "piechart");
      setDailyPieChartStats(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  const getStatsTodayStateServices = async () => {
    const config = {
      headers: {
        "content-type": "application/json",
      },
    };
    try {
      const res = await axios.get(
        `${TUNNEL}/api/stats/service-states-today`,
        config
      );
      setServiceStatesToday(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  const getNumberOfServicesByCity = async () => {
    const config = {
      headers: {
        "content-type": "application/json",
      },
    };
    try {
      const res = await axios.get(
        `${TUNNEL}/api/stats/total-services-per-city`,
        config
      );
      setNumberOfServicesPerCity(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  const getMostWantedServiceRegion = async () => {
    const config = {
      headers: {
        "content-type": "application/json",
      },
    };
    try {
      const res = await axios.get(
        `${TUNNEL}/api/stats/most-wanted-service-region`,
        config
      );
      setMostWantedServiceRegion(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  const getTopRatedEmployees = async () => {
    const config = {
      headers: {
        "content-type": "application/json",
      },
    };
    try {
      const res = await axios.get(
        `${TUNNEL}/api/stats/top-rated-employees`,
        config
      );
      setTopRatedEmployees(res.data);
    } catch (e) {
      console.log(e);
    }
  };
  const getMostWantedEmployees = async () => {
    const config = {
      headers: {
        "content-type": "application/json",
      },
    };
    try {
      const res = await axios.get(
        `${TUNNEL}/api/stats/most-wanted-employees`,
        config
      );
      setMostWantedEmployees(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (topRatedEmployees && topRatedEmployees.length > 0) {
      setRowsRatedEmployees(
        topRatedEmployees.map((employee, index) => {
          const {
            fullName,
            department,
            city,
            citizenID,
          } = employee.employeeInfo;
          return (
            <tr key={index}>
              <td>{fullName}</td>
              <td>{department}</td>
              <td>{city}</td>
              <td>{citizenID}</td>
              <td>{employee.ratingAverage.toFixed(2)}</td>
            </tr>
          );
        })
      );
    }
  }, [topRatedEmployees]);
  useEffect(() => {
    if (mostWantedEmployees && mostWantedEmployees.length > 0) {
      setRowsWantedEmployees(
        mostWantedEmployees.map((employee, index) => {
          const {
            fullName,
            department,
            city,
            citizenID,
          } = employee.employeeInfo;
          return (
            <tr key={index}>
              <td>{fullName}</td>
              <td>{department}</td>
              <td>{city}</td>
              <td>{citizenID}</td>
              <td>{employee.totalServices}</td>
            </tr>
          );
        })
      );
    }
  }, [mostWantedEmployees]);

  //OJO VER LOS CASOS EN LOS QUE ESTÉN VACÍOS
  useEffect(() => {
    getStatsTodayPieChart();
    getStatsTodayStateServices();
    getNumberOfServicesByCity();
    getMostWantedServiceRegion();
    getTopRatedEmployees();
    getMostWantedEmployees();
  }, []);
  return (
    <div className="reports-container">
      <div className="title-reports">Indicadores de hoy</div>
      <div
        className="stats-no-services"
        style={{
          display:
            dailyPieChartStats && dailyPieChartStats.length !== 0 && "none",
        }}
      >
        No hay servicios el día de hoy.
      </div>
      <div
        className="graphs-container"
        style={{
          display:
            dailyPieChartStats && dailyPieChartStats.length === 0 && "none",
        }}
      >
        <div className="types-services-container">
          <div>
            <span>Servicios Programados:</span>{" "}
            {serviceStatesToday.programmedServices}{" "}
          </div>
          <div>
            {" "}
            <span>Servicios Activos:</span> {serviceStatesToday.activeServices}{" "}
          </div>
          <div>
            {" "}
            <span>Servicios Realizados:</span> {serviceStatesToday.doneServices}{" "}
          </div>
        </div>
        <Chart
          width={"500px"}
          height={"300px"}
          chartType="PieChart"
          loader={<div>Cargando Gráfico</div>}
          data={dailyPieChartStats}
          options={{
            title: "Mis servicios de hoy por ciudad",
          }}
        />
      </div>
      <div className="title-reports">Servicios Históricos</div>
      <div
        className="stats-no-services"
        style={{
          display:
            numberOfServicesPerCity &&
            numberOfServicesPerCity.length !== 0 &&
            "none",
        }}
      >
        No se ha registrado un servicio nunca.
      </div>
      <div
        className="graphs-container"
        style={{
          display:
            numberOfServicesPerCity &&
            numberOfServicesPerCity.length === 0 &&
            "none",
        }}
      >
        <Chart
          style={{ container: { position: "relative" } }}
          width={"800px"}
          height={"1000px"}
          chartType="BarChart"
          loader={<div>Cargando Gráfico</div>}
          data={mostWantedServiceRegion}
          options={{
            title: "Servicio más solicitado por ciudad",
            chartArea: { width: "40%" },
            hAxis: {
              title: "Cantidad solicitado",
              minValue: 0,
            },
            vAxis: {
              title: "Ciudad",
            },
          }}
        />

        <Chart
          width={"600px"}
          height={"500px"}
          chartType="PieChart"
          loader={<div>Cargando Gráfico</div>}
          data={numberOfServicesPerCity}
          options={{
            title: "Mis servicios totales por ciudad",
          }}
        />
      </div>
      <div className="title-reports">Empleadas - Top 5 Mejor Calificadas</div>
      <div
        className="stats-no-services"
        style={{
          display:
            rowsRatedEmployees && rowsRatedEmployees.length !== 0 && "none",
        }}
      >
        No hay datos de empleadas.
      </div>
      <table
        className="tableStats"
        style={{
          display:
            rowsRatedEmployees && rowsRatedEmployees.length === 0 && "none",
        }}
      >
        <tr>
          <th>Nombre Completo</th>
          <th>Departamento</th>
          <th>Ciudad</th>
          <th>Cédula</th>
          <th>Calificación (1-5)</th>
        </tr>
        {rowsRatedEmployees}
      </table>

      <div className="title-reports">Empleadas - Top 5 Más Solicitadas</div>
      <div
        className="stats-no-services"
        style={{
          display:
            rowsWantedEmployees && rowsWantedEmployees.length !== 0 && "none",
        }}
      >
        No hay datos de empleadas.
      </div>
      <table
        className="tableStats"
        style={{
          marginBottom: "30px",
          display:
            rowsWantedEmployees && rowsWantedEmployees.length === 0 && "none",
        }}
      >
        <tr>
          <th>Nombre Completo</th>
          <th>Departamento</th>
          <th>Ciudad</th>
          <th>Cédula</th>
          <th>Servicios Totales</th>
        </tr>
        {rowsWantedEmployees}
      </table>
    </div>
  );
};

export default withRouter(Reports);
