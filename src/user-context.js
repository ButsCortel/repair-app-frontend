import React, { useState, createContext } from "react";
//create a state that will be available for every child component
export const UserContext = createContext();

export const ContextWrapper = (props) => {
  const defaultValueHandler = () => {
    const user = localStorage.getItem("token");
    if (user) return true;
    return false;
  };

  const [isLoggedIn, setIsLoggedIn] = useState(defaultValueHandler());
  const user = {
    isLoggedIn,
    setIsLoggedIn,
  };

  return (
    <UserContext.Provider value={user}>{props.children}</UserContext.Provider>
  );
};
