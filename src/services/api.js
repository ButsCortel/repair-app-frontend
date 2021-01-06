import axios from "axios";
// const PORT = process.env.PORT || 8000;

const api = axios.create({
  baseURL: `https://fixed-it.herokuapp.com/`,
});
export default api;
