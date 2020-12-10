import React, { useContext, useState } from "react";
import { Button } from "react-bootstrap";
import moment from "moment";
import { SessionContext } from "../../../session-context";

const RequestRow = ({ data, handleClick }) => {
  const { statusColor } = useContext(SessionContext);
  const newDate = (date) => {
    const original = moment(date);
    return original.format("l, h:mm a");
  };
  return (
    <tr onClick={() => handleClick(data._id)}>
      <td>
        <img alt="device image" key={data._id} src={data.image_url} />

        <div>{data.device}</div>
      </td>
      <td>
        <span>{data.issue}</span>
      </td>
      <td className={data.expedite ? "text-danger font-weight-bold" : ""}>
        {data.expedite ? "EXPEDITE" : "Regular"}
      </td>
      <td className={`font-weight-bold text-${statusColor(data.status)}`}>
        {data.status}
      </td>
      <td title={newDate(data.lastUpdate)}>
        {moment(data.lastUpdate).fromNow()}
      </td>
    </tr>
  );
};
export default React.memo(RequestRow);
