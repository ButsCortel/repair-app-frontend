import React, { useState, useEffect } from "react";
import api from "../../../services/api";
import moment from "moment";
import { FaRegQuestionCircle } from "react-icons/fa";
const TimeDisplay = ({ id }) => {
  const token = localStorage.getItem("token");
  const [repair, setRepair] = useState(null);
  useEffect(() => getRepair(), []);
  useEffect(() => {
    const interval = setInterval(() => getRepair(), 1000);
    return () => clearInterval(interval);
  }, [repair]);
  const getRepair = () => {
    api
      .get("/requests/" + id, {
        headers: { "auth-token": token },
      })
      .then((response) => {
        setRepair(response.data.repair);
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
  const parseMilli = (ongoing) => {
    const duration = moment.duration(ongoing);
    const days = Math.floor(duration.asDays());
    const hours = Math.floor(duration.asHours());

    return `${days ? days + "d" : ""} ${
      !hours
        ? ""
        : hours > 23
        ? moment.utc(ongoing).format("h") + "hr"
        : hours + "hr"
    } ${moment.utc(ongoing).format("mm")}min`;
  };
  return (
    <>
      <ul className="p-0 m-0">
        <li title="Time spent working (ONGOING)">
          Time spent:
          <FaRegQuestionCircle style={{ verticalAlign: "baseline" }} />
        </li>
        <li>
          {repair
            ? repair.totalOngoing && repair.status === "ONGOING"
              ? timeOngoing(repair.totalOngoing, repair.lastUpdate)
              : !repair.totalOngoing && repair.status === "ONGOING"
              ? timeElapsed(repair.lastUpdate)
              : repair.totalOngoing && repair.status !== "ONGOING"
              ? parseMilli(repair.totalOngoing)
              : "N/A"
            : "-d --hr --min"}
        </li>
        <li title="Time elapsed from start (INCOMING)">
          Total time:{" "}
          <FaRegQuestionCircle style={{ verticalAlign: "baseline" }} />
        </li>
        <li>
          {repair
            ? !repair.totalTime
              ? timeElapsed(repair.dateCreated)
              : parseMilli(repair.totalTime)
            : "-d --hr --min"}
        </li>
      </ul>
    </>
  );
};

export default TimeDisplay;
