import React, { useEffect, useState } from "react";

import { FaRegQuestionCircle } from "react-icons/fa";

import moment from "moment";

import api from "../../../services/api";
const TimeDisplay = () => {
  const token = localStorage.getItem("token");
  const [repair, setRepair] = useState(null);
  useEffect(() => {
    getRepair();
  }, []);
  useEffect(() => {
    let interval;
    if (repair) {
      interval = setInterval(() => {
        getRepair();
      }, 10000);
    }

    return () => clearInterval(interval);
  }, [repair]);
  const getRepair = () => {
    api
      .get("/tech/ongoing", {
        headers: { "auth-token": token },
      })
      .then((response) => {
        setRepair(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const timeElapsed = (lastUpdate) => {
    const timeDiff = Date.now() - Date.parse(lastUpdate);
    const duration = moment.duration(timeDiff);
    const days = Math.floor(duration.asDays());
    const hours = Math.floor(duration.asHours());

    return `${days ? days + "d" : ""} ${
      !hours
        ? ""
        : hours > 23
        ? moment.utc(timeDiff).format("h") + "hr"
        : hours + "hr"
    } ${moment.utc(timeDiff).format("mm")}min`;
  };
  const timeOngoing = (ongoing, lastUpdate) => {
    const timeDiff = ongoing + (Date.now() - Date.parse(lastUpdate));
    const duration = moment.duration(timeDiff);
    const days = Math.floor(duration.asDays());
    const hours = Math.floor(duration.asHours());
    return `${days ? days + "d" : ""} ${
      !hours
        ? ""
        : hours > 23
        ? moment.utc(timeDiff).format("h") + "hr"
        : hours + "hr"
    } ${moment.utc(timeDiff).format("mm")}min`;
  };
  return (
    <ul>
      <li title="Time spent working (ONGOING)">
        Time spent:
        <FaRegQuestionCircle style={{ verticalAlign: "baseline" }} />
      </li>
      <li>
        {repair
          ? repair.totalOngoing
            ? timeOngoing(repair.totalOngoing, repair.lastUpdate)
            : timeElapsed(repair.lastUpdate)
          : "-d --hr --min"}
      </li>
      <li title="Time elapsed from start (INCOMING)">
        Total time:
        <FaRegQuestionCircle style={{ verticalAlign: "baseline" }} />
      </li>
      <li>{repair ? timeElapsed(repair.dateCreated) : "-d --hr --min"}</li>
    </ul>
  );
};

export default TimeDisplay;
