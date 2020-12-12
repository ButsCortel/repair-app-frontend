import React, { useContext, useEffect, useState } from "react";
import moment from "moment";
import { SessionContext } from "../../../session-context";
const missing = require("../../../assets/no_image.png");
console.log(missing);

const RequestRow = ({ data, handleClick }) => {
  const { statusColor } = useContext(SessionContext);
  const [src, setSrc] = useState("");

  // useEffect(() => {
  //   !data.repair
  //     ? setSrc(require("../../../assets/no_image.png"))
  //     : setSrc(data.repair.image_url);
  // }, []);

  const newDate = (date) => {
    const original = moment(date);
    return original.format("l, h:mm a");
  };
  return (
    <tr
      className="tr-myRepairs"
      disabled
      onClick={data.repair && (() => handleClick(data.repair._id))}
      title={!data.repair ? "Request has been deleted" : ""}
    >
      <td>
        <img
          src={
            data.repair
              ? data.repair.image_url
              : require("../../../assets/no_image.png").default
          }
        />
        <span>{data.device}</span>
      </td>
      <td>{newDate(data.date)}</td>
      <td className={`font-weight-bold text-${statusColor(data.status)}`}>
        {data.status}
      </td>
      <td>
        <span>{data.note}</span>
      </td>
    </tr>
  );
};
export default React.memo(RequestRow);
