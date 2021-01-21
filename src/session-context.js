import React, { useState, createContext } from "react";
//create a state that will be available for every child component
export const SessionContext = createContext();

export const ContextWrapper = (props) => {
  const defaultValueHandler = () => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (user && token) return true;
    return false;
  };

  const [isLoggedIn, setIsLoggedIn] = useState(defaultValueHandler());
  const [repairs, setRepairs] = useState([]);

  const value = React.useMemo(
    () => ({
      isLoggedIn,
      setIsLoggedIn,
      repairs,
      setRepairs,
    }),
    [isLoggedIn, repairs]
  );

  return (
    <SessionContext.Provider value={value}>
      {props.children}
    </SessionContext.Provider>
  );
};
