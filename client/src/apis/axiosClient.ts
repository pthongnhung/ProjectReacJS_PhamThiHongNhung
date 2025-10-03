import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:8080", // json-server
  headers: { "Content-Type": "application/json" },
});

export default axiosClient;
