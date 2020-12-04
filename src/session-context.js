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
  const [repair, setRepair] = useState({});
  const value = React.useMemo(
    () => ({
      isLoggedIn,
      setIsLoggedIn,
      repairs,
      setRepairs,
      repair,
      setRepair,
    }),
    [isLoggedIn, repairs, repair]
  );

  return (
    <SessionContext.Provider value={value}>
      {props.children}
    </SessionContext.Provider>
  );
};
