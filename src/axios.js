import axios from "axios";

const token = localStorage.getItem("user-token");

const serverApi = axios.create({
  baseURL: "https://server.muhseena.tech/api",
});

export default serverApi;
