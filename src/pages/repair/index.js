import React, { useEffect, useState } from "react";
import api from "../../services/api";

const RepairPage = ({ history }) => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");

  useEffect(() => {
    if (!user || !token) return history.push("/login");
    getRepairs();
  }, []);

  const getRepairs = async () => {
    try {
      const response = await api.get("/requests/all", {
        headers: { "auth-token": token },
      });
      console.log(response.data);
    } catch (error) {
      console.log(error.response.data);
    }
  };
  return (
    <>
      <h1>Repairs</h1>
    </>
  );
};

export default RepairPage;
