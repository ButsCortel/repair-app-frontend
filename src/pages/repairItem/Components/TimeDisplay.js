import React, { useState, useEffect } from "react";
import moment from "moment";
import { FaRegQuestionCircle } from "react-icons/fa";
const TimeDisplay = ({ repair }) => {
  const [time, setTime] = useState(Date.now);
  useEffect(() => {
    const updateTime = () => {
      setTime(Date.now);
    };
    const interval = setInterval(updateTime, 1000);

    return () => clearInterval(interval);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const timeElapsed = (lastUpdate) => {
    const timeDiff = time - Date.parse(lastUpdate);
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
    const timeDiff = ongoing + (time - Date.parse(lastUpdate));
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
