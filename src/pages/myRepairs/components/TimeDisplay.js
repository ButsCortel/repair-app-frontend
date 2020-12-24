import React, { useEffect, useState } from "react";

import { FaRegQuestionCircle } from "react-icons/fa";

import moment from "moment";

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
  return (
    <ul className="mb-0">
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
