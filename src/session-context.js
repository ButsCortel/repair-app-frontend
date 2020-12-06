import React, { useState, createContext } from "react";
//create a state that will be available for every child component
export const SessionContext = createContext();

export const ContextWrapper = (props) => {
  const defaultValueHandler = () => {
    const user = localStorage.getItem("token");
    if (user) return true;
    return false;
  };

  const [isLoggedIn, setIsLoggedIn] = useState(defaultValueHandler());
  const [repairs, setRepairs] = useState([]);
  const statusColor = (status) => {
    switch (status) {
      case "RECEIVED":
        return "secondary";
      case "ONGOING":
        return "warning";
      case "ON HOLD":
        return "danger";
      case "Cancelled":
        return "secondary";
      case "OUTGOING":
        return "info";
      case "COMPLETED":
        return "success";
      default:
        return "primary";
    }
  };
  const value = React.useMemo(
    () => ({
      isLoggedIn,
      setIsLoggedIn,
      repairs,
      setRepairs,
      statusColor,
    }),
    [isLoggedIn, repairs]
  );

  return (
    <SessionContext.Provider value={value}>
      {props.children}
    </SessionContext.Provider>
  );
};
