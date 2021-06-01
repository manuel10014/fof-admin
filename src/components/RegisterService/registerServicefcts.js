import React from "react";
import CustomToast from "../custom-toast";
import { toast } from "react-toastify";
import axios from "axios";
import citiesJSON from "../RegisterEmployee/colombia";
import { TUNNEL } from '../../assets/constants/url'

export const handleRestriction = (timeRestrictions, durationHours) => {
  let pass = true;
  for (let i = 0; i < timeRestrictions.length; i++) {
    if (timeRestrictions[i][0] >= timeRestrictions[i][1]) {
      toast(
        <CustomToast title="¡El tiempo inicial no puede ser igual o mayor al tiempo final en la restricción!" />
      );
      pass = false;
      break;
    }
  }
  for (let i = 0; i < timeRestrictions.length; i++) {
    if (
      (!timeRestrictions[i][0] && timeRestrictions[i][0] !== 0) ||
      (!timeRestrictions[i][1] && timeRestrictions[i][1] !== 0)
    ) {
      toast(
        <CustomToast title="¡No se pueden dejar restricciones en blanco!" />
      );
      pass = false;
      break;
    }
  }
  for (let i = 0; i < timeRestrictions.length; i++) {
    let difference = timeRestrictions[i][1] - timeRestrictions[i][0];
    if (difference < durationHours) {
      toast(
        <CustomToast title="¡El tiempo de la restricción tiene que ser mayor o igual a la duración del servicio!" />
      );
      pass = false;
      break;
    }
  }
  for (let i = 0; i < timeRestrictions.length; i++) {
    let interferes = false;
    for (let j = 0; j < timeRestrictions.length; j++) {
      if (i !== j) {
        if (
          (timeRestrictions[i][0] >= timeRestrictions[j][0] &&
            timeRestrictions[i][1] < timeRestrictions[j][1]) ||
          (timeRestrictions[i][0] >= timeRestrictions[j][0] &&
            timeRestrictions[i][0] < timeRestrictions[j][1])
        ) {
          toast(<CustomToast title="¡Hay restricciones que se traslapan!" />);
          interferes = true;
          pass = false;
          break;
        } else if (
          timeRestrictions[i][0] === timeRestrictions[j][0] &&
          timeRestrictions[i][1] === timeRestrictions[j][1]
        ) {
          toast(<CustomToast title="¡Hay restricciones iguales!" />);
          interferes = true;
          pass = false;
          break;
        } else if (timeRestrictions[i][1] === timeRestrictions[j][0]) {
          toast(
            <CustomToast title="¡El tiempo final de una restricción no puede ser igual al tiempo inicial de otra restricción!" />
          );
          interferes = true;
          pass = false;
        }
      }
    }
    if (interferes) {
      break;
    }
  }

  return pass;
};

export const registerServiceAPI = async (
  name,
  description,
  durationHours,
  citiesAvailable,
  timeRestrictions,
  activities,
  price,
  discount,
  surcharge
) => {
  const service = {
    name: name.trim(),
    description,
    durationHours,
    citiesAvailable,
    timeRestrictions,
    activities,
    price,
    discount,
    surcharge
  };
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const body = JSON.stringify(service);
    const res = await axios.post(
      `${TUNNEL}/api/services/register`,
      body,
      config
    );
    toast(<CustomToast title="¡Registro de servicio exitoso!" />);
  } catch (err) {
    toast(<CustomToast title={err.response.data.errors[0].msg} />);
  }
};
