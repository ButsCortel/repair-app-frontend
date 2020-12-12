import React from "react";
import moment from "moment";
const HistoryRow = (props) => {
  const newDate = (date) => {
    const original = moment(date);
    return original.format("MM/DD/ YYYY, h:mm:ss a");
  };
  return (
    <tr>
      <td>{newDate(props.data.date)}</td>
      <td className="position-relative repairItem">
        <span>
          {props.data.user.firstName} {props.data.user.lastName}
        </span>
        <a className="email" href={`mailto:${props.data.user.email}`}>
          {props.data.user.email}
        </a>
      </td>
      <td>{props.data.status}</td>
      <td className="repairItem">
        <span>{props.data.note}</span>
      </td>
    </tr>
  );
};

export default HistoryRow;
