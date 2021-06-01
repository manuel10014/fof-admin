import React, { useState, useEffect } from "react";
import "./RegisterEmployee.css";
import axios from "axios";
import CustomToast from "../custom-toast";
import { toast } from "react-toastify";
import RegisterPart1 from "./RegisterPart1";
import RegisterPart2 from "./RegisterPart2";
import citiesJSON from "./colombia";
import BackArrow from "../../assets/images/backarrow.png";
import { TUNNEL } from '../../assets/constants/url'

const RegisterEmployee = ({
  editing,
  selectedEmployee,
  setShowEditEmployee,
  ...props
}) => {
  // REMEMBER TO SEND attendedServices TO 0
  // REMEMBER TO SEND busySchedule as an empty array
  // REMEMBER TO SEND absenteeism as an empty array
  const [firstName, setFirstName] = useState("");
  const [secondName, setSecondName] = useState("");
  const [lastName, setLastName] = useState("");
  const [secondLast, setSecondLast] = useState("");
  const [citizenID, setCitizenID] = useState("");
  const [skills, setSkills] = useState([""]);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [city, setCity] = useState("");
  const [department, setDepartment] = useState("");
  const [password, setPassword] = useState("");
  const [confPass, setConfPass] = useState("");
  const [next, setNext] = useState(false);
  const [cities, setCities] = useState([]);
  const [windowWidth, setWindowWidth] = useState(null);
  const [windowHeight, setWindowHeight] = useState(null);
  const allDepartments = citiesJSON.map((ele) => ele.departamento);
  const [address, setAddress] = useState("");
  const [fileB, setFileB] = useState(null); //Foto de Perfil
  const [fileFB, setFileFB] = useState(null); // Foto de Perfil que se envía a db
  const [fileCV, setFileCV] = useState(null); // Archivo pdf de hoja de vida
  const [fileFCV, setFileFCV] = useState(null); // hoja de vida a db
  const [fileARL, setFileARL] = useState(null); // ARL en pdf
  const [fileFARL, setFileFARL] = useState(null); // ARL a db
  const [isMaidActive, setIsMaidActive] = useState(null);

  useEffect(() => {
    if (department !== "") {
      const listCities = citiesJSON.filter(
        (ele) => ele.departamento === department
      )[0].ciudades;
      setCities(listCities);
    }
  }, [department]);

  useEffect(() => {
    if (editing === true) {
      const {
        firstName,
        secondName,
        lastName,
        secondLastName,
        citizenID,
        city,
        department,
        phone,
        address,
        CV,
        ARL,
        email,
        skills,
        active,
      } = selectedEmployee;
      setFirstName(firstName);
      setSecondName(secondName);
      setLastName(lastName);
      setSecondLast(secondLastName);
      setEmail(email);
      setCitizenID(citizenID);
      setDepartment(department);
      setCity(city);
      setAddress(address);
      setPhone(phone);
      setSkills(skills);
      setFileCV("Archivo");
      setFileARL("Archivo");
      setFileFCV("Archivo");
      setFileFARL("Archivo");
      setFileFB("Archivo");
      setIsMaidActive(active);
    }
  }, [editing]);
  const skillModifier = (idx, e) => {
    setSkills((prevSkills) => {
      let newSkills = [...prevSkills];
      newSkills[idx] = e;
      return newSkills;
    });
  };

  const skillRemover = (idx) => {
    setSkills((prevSkills) =>
      prevSkills.filter((skill, index) => index !== idx)
    );
  };

  const handleDepartmentChange = (value) => {
    setCities([]);
    setCity("");
    setDepartment(value);
  };

  const readFile = (event) => {
    setFileB(URL.createObjectURL(event.target.files[0]));
    setFileFB(event.target.files[0]);
    console.log(event.target.files[0], "files0");
  };

  const readFileCV = (event) => {
    setFileCV(URL.createObjectURL(event.target.files[0]));
    setFileFCV(event.target.files[0]);
  };

  const readFileARL = (event) => {
    setFileARL(URL.createObjectURL(event.target.files[0]));
    setFileFARL(event.target.files[0]);
  };

  const fileVerificationARLCV = () => {
    let pass = false;
    if (
      fileFCV.type === "application/pdf" &&
      fileFARL.type === "application/pdf"
    ) {
      pass = true;
      return pass;
    } else {
      toast(
        <CustomToast title="¡ARL y Hoja de Vida tienen que estar en formato pdf!" />
      );
      return pass;
    }
  };

  const fileVerification = () => {
    let pass = false;
    if (
      fileFB.type === "image/jpeg" ||
      fileFB.type === "image/jpg" ||
      fileFB.type === "image/png"
    ) {
      pass = true;
      return pass;
    } else {
      toast(<CustomToast title="¡Solo se aceptan imágenes jpeg, jpg y png!" />);
      return pass;
    }
  };

  const register = async () => {
    if (!fileFB) {
      toast(<CustomToast title="¡Inserte una imagen!" />);
    } else {
      const user = {
        firstName: firstName.trim(),
        secondName: secondName.trim(),
        lastName: lastName.trim(),
        secondLast: secondLast.trim(),
        citizenID,
        skills,
        phone,
        email: email.trim(),
        city,
        department,
        password,
        passRepeat: confPass,
        address,
      };

      let passes1 = fileVerification();
      let passes2 = fileVerificationARLCV();

      if (passes1 && passes2) {
        const formData = new FormData();
        const formDataCV = new FormData();
        const formDataARL = new FormData();
        formData.append("file", fileFB);
        formData.append("filename", fileFB.name);
        formDataCV.append("file", fileFCV);
        formDataCV.append("filename", fileFCV.name);
        formDataARL.append("file", fileFARL);
        formDataARL.append("filename", fileFARL.name);
        try {
          const config = {
            headers: {
              "Content-Type": "application/json",
            },
          };
          const body = JSON.stringify(user);
          const res = await axios.post(
            `${TUNNEL}/api/users/employee`,
            body,
            config
          );
          formData.append("employeeID", res.data.employeeID);
          formDataCV.append("employeeID", res.data.employeeID);
          formDataARL.append("employeeID", res.data.employeeID);

          await axios.post(
            `${TUNNEL}/api/files/profile-pic-employee`,
            formData,
            config
          );
          await axios.post(
            `${TUNNEL}/api/files/CV-employee`,
            formDataCV,
            config
          );
          await axios.post(
            `${TUNNEL}/api/files/ARL-employee`,
            formDataARL,
            config
          );
          toast(<CustomToast title="¡Registro exitoso!" />);
        } catch (err) {
          toast(<CustomToast title={err.response.data.errors[0].msg} />);
        }
      }
    }
  };

  const edit = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    let errors = 0;
    try {
      if (fileFB !== "Archivo") {
        // El usuario cambió la foto de perfil de la empleada
        let passes1 = fileVerification();
        if (passes1) {
          const formData = new FormData();
          formData.append("file", fileFB);
          formData.append("filename", fileFB.name);
          formData.append("employeeID", selectedEmployee._id);
          await axios.post(
            `${TUNNEL}/api/files/profile-pic-employee`,
            formData,
            config
          );
        } else {
          errors++;
        }
      }

      const formDataCV = new FormData();
      const formDataARL = new FormData();
      formDataCV.append("file", fileFCV);
      formDataCV.append("filename", fileFCV.name);
      formDataARL.append("file", fileFARL);
      formDataARL.append("filename", fileFARL.name);
      formDataCV.append("employeeID", selectedEmployee._id);
      formDataARL.append("employeeID", selectedEmployee._id);
      // Cambió tanto ARL como CV
      if (fileFCV !== "Archivo" && fileFARL !== "Archivo") {
        let passes2 = fileVerificationARLCV();
        if (passes2) {
          await axios.post(
            `${TUNNEL}/api/files/CV-employee`,
            formDataCV,
            config
          );
          await axios.post(
            `${TUNNEL}/api/files/ARL-employee`,
            formDataARL,
            config
          );
        } else {
          errors++;
        }
      } else if (fileFCV !== "Archivo" && fileFARL === "Archivo") {
        // Solo cambió el CV
        if (fileFCV.type === "application/pdf") {
          await axios.post(
            `${TUNNEL}/api/files/CV-employee`,
            formDataCV,
            config
          );
        } else {
          errors++;
          toast(
            <CustomToast title="¡Hoja de vida tiene que estar en formato pdf!" />
          );
        }
      } else if (fileFARL !== "Archivo" && fileFCV === "Archivo") {
        // Solo cambió el ARL
        if (fileFARL.type === "application/pdf") {
          await axios.post(
            `${TUNNEL}/api/files/ARL-employee`,
            formDataARL,
            config
          );
        } else {
          errors++;
          toast(<CustomToast title="¡ARL tiene que estar en formato pdf!" />);
        }
      }
      const user = {
        firstName: firstName.trim(),
        secondName: secondName.trim(),
        lastName: lastName.trim(),
        secondLast: secondLast.trim(),
        citizenID,
        skills,
        phone,
        email: email.trim(),
        city,
        department,
        address,
        employeeID: selectedEmployee._id,
      };
      const body = JSON.stringify(user);
      if (errors === 0) {
        const resServer = await axios.post(
          `${TUNNEL}/api/users/employee-edit`,
          body,
          config
        );
        toast(<CustomToast title={resServer.data} />);
      }
    } catch (err) {
      toast(<CustomToast title={err.response.data.errors[0].msg} />);
    }
  };

  const disableMaid = async () => {
    try {
      const user = {
        employeeID: selectedEmployee._id,
      };
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const body = JSON.stringify(user);
      const res = await axios.post(
        `${TUNNEL}/api/users/deactivate-employee`,
        body,
        config
      );
      toast(<CustomToast title="Empleada deshabilitada." />);
      setIsMaidActive(false);
    } catch (e) {
      console.log(e);
    }
  };
  const enableMaid = async () => {
    try {
      const user = {
        employeeID: selectedEmployee._id,
      };
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const body = JSON.stringify(user);
      const res = await axios.post(
        `${TUNNEL}/api/users/activate-employee`,
        body,
        config
      );
      toast(<CustomToast title="Empleada habilitada." />);
      setIsMaidActive(true);
    } catch (e) {
      console.log(e);
    }
  };
  return (
    <div
      style={{
        display: "flex",
        overflow: "hidden",
        alignItems: "center",
      }}
    >
      {!next ? (
        <RegisterPart1
          editing={editing}
          selectedEmployee={selectedEmployee}
          setFirstName={setFirstName}
          firstName={firstName}
          setSecondName={setSecondName}
          secondName={secondName}
          setLastName={setLastName}
          lastName={lastName}
          setSecondLast={setSecondLast}
          secondLast={secondLast}
          setCitizenID={setCitizenID}
          citizenID={citizenID}
          setPhone={setPhone}
          phone={phone}
          setCity={setCity}
          city={city}
          setDepartment={setDepartment}
          department={department}
          setEmail={setEmail}
          email={email}
          setNext={setNext}
          cities={cities}
          setCities={setCities}
          allDepartments={allDepartments}
          handleDepartmentChange={handleDepartmentChange}
          address={address}
          setAddress={setAddress}
          readFile={readFile}
          fileB={fileB}
          fileFB={fileFB}
          setShowEditEmployee={setShowEditEmployee}
        />
      ) : (
        <RegisterPart2
          editing={editing}
          selectedEmployee={selectedEmployee}
          setPassword={setPassword}
          password={password}
          setConfPass={setConfPass}
          confPass={confPass}
          setNext={setNext}
          register={register}
          skillModifier={skillModifier}
          skills={skills}
          setSkills={setSkills}
          skillRemover={skillRemover}
          fileARL={fileARL}
          fileCV={fileCV}
          fileFARL={fileFARL}
          fileFCV={fileFCV}
          readFileCV={readFileCV}
          readFileARL={readFileARL}
          edit={edit}
          disableMaid={disableMaid}
          active={selectedEmployee && isMaidActive}
          enableMaid={enableMaid}
        />
      )}
    </div>
  );
};

export default RegisterEmployee;
