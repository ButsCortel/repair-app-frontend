import React from "react";
import moment from "moment";

const RequestRow = ({ data, handleClick, setShow }) => {
  const newDate = (date) => {
    const original = moment(date);
    return original.format("l, h:mm a");
  };
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

  return (
    <tr
      className="tr-myRepairs"
      onClick={
        data.repair ? () => handleClick(data.repair._id) : () => setShow(true)
      }
      title={!data.repair ? "Request has been deleted" : ""}
    >
      <td>
        <img
          src={
            data.repair
              ? data.repair.image_url
              : require("../../../assets/no_image.png").default
          }
          alt="device"
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
