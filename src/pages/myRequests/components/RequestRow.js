import React, { useContext } from "react";
import { Button } from "react-bootstrap";
import moment from "moment";
import { SessionContext } from "../../../session-context";

const RequestRow = ({
  data,
  handleClick,
  handleDelete,
  handleCancel,
  user,
}) => {
  const { statusColor } = useContext(SessionContext);
  const newDate = (date) => {
    const original = moment(date);
    return original.format("l, h:mm a");
  };
  return (
    <tr onClick={(e) => handleClick(e, data._id)}>
      <td>
        <img className="h-auto" src={data.image_url} className="" />
      </td>
      <td>{data.device}</td>
      <td>{data.issue}</td>
      <td className={data.expedite ? "text-danger font-weight-bold" : ""}>
        {data.expedite ? "EXPEDITE" : "Regular"}
      </td>
      <td className={`font-weight-bold text-${statusColor(data.status)}`}>
        {data.status}
      </td>
      <td title={newDate(data.lastUpdate)}>
        {moment(data.lastUpdate).fromNow()}
      </td>
      <td
        title={data.status !== "INCOMING" ? "Request already aknowledged!" : ""}
        className="buttons"
      >
        <Button
          disabled={
            data.status !== "INCOMING" &&
            data.status !== "CANCELLED" &&
            user.type !== "ADMIN"
          }
          variant="warning"
          className="rounded-pill mx-auto mb-1 d-block w-75"
          onClick={(e) => handleCancel(e, data._id)}
        >
          cancel
        </Button>
        <Button
          disabled={
            data.status !== "INCOMING" &&
            data.status !== "CANCELLED" &&
            user.type !== "ADMIN"
          }
          variant="danger"
          className="rounded-pill mx-auto d-block w-75"
          onClick={(e) => handleDelete(e, data._id)}
        >
          delete
        </Button>
      </td>
    </tr>
  );
};
export default RequestRow;
