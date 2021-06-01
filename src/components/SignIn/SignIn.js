import React, { useEffect } from "react";

const SignIn = () => {
  const baseDate = [1606280400, 1606366800]; // seconds 25/11/2020 00:00 -5 GMT
  // 25/11/2020 8:00 a.m - 25/11/2020 9 a.m ;  25/11/2020 2p.m - 25/11/2020 3p.m
  const scheduleEmployee = [
    // 8-9                                                       2-3
    [
      { ti: 1606309200, tf: 1606316400, nombre: "Diana" },
      { ti: 1606330800, tf: 1606334400, nombre: "Diana" },
    ],
    // 8-10                                                        2-3
    [{ ti: 1606309200, tf: 1606316400, nombre: "Martha" }],
  ]; // seconds, invertir orden
  const serviceRestrictions = [
    [8, 12],
    [14, 18],
  ];
  const serviceDuration = 3; // hours
  let possibleSlots = [];

  const calculatePossibleSlots = () => {
    for (let m = 0; m < baseDate.length; m++) {
      for (let k = 0; k < scheduleEmployee.length; k++) {
        for (let i = 0; i < serviceRestrictions.length; i++) {
          let currentHour = serviceRestrictions[i][0];
          while (currentHour + serviceDuration <= serviceRestrictions[i][1]) {
            // To get all possible values within that slot
            let lowerLimit = baseDate[m] + currentHour * 3600;
            let upperLimit = lowerLimit + serviceDuration * 3600;
            let interferes = false;
            for (let j = 0; j < scheduleEmployee[k].length; j++) {
              let currentSchedule = scheduleEmployee[k][j];
              let lowerLimit2 = currentSchedule.ti;
              let upperLimit2 = currentSchedule.tf;
              if (
                upperLimit2 < baseDate[m] + 24 * 3600 &&
                lowerLimit2 > baseDate[m]
              ) {
                // It is within the current date...
                if (
                  (lowerLimit >= lowerLimit2 && lowerLimit < upperLimit2) ||
                  (upperLimit >= lowerLimit2 && upperLimit < upperLimit2)
                ) {
                  interferes = true;
                }
              }
            }
            if (!interferes) {
              possibleSlots.push([
                currentHour,
                currentHour + serviceDuration,
                scheduleEmployee[k][0].nombre,
                baseDate[m],
              ]);
            }
            currentHour++;
          }
        }
      }
    }
  };


  useEffect(() => {
    calculatePossibleSlots();
  }, []);
  return <div>SignIn</div>;
};

export default SignIn;
