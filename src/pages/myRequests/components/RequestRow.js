import React from "react";
import moment from "moment";

const RequestRow = ({ data, handleClick }) => {
  const statusColor = (status) => {
    switch (status) {
      case "ONGOING":
        return "warning";
      case "ON HOLD":
        return "danger";
      case "CANCELLED":
        return "secondary";
      case "OUTGOING":
        return "info";
      case "COMPLETED":
        return "success";
      default:
        return "primary";
    }
  };
  const newDate = (date) => {
    const original = moment(date);
    return original.format("l, h:mm a");
  };
  return (
    <tr className="tr-myRequests" onClick={() => handleClick(data._id)}>
      <td>
        <span className="img-span d-flex justify-content-center align-items-center">
          <img alt="device" key={data._id} src={data.image_url} />
        </span>

        <span className="device-name">{data.device}</span>
      </td>
      <td>
        <span className="scroll-span">{data.issue}</span>
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
