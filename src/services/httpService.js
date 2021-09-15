import axios from "axios";
//import auth from "./authService";
import { toast } from "react-toastify";

//axios.defaults.headers.common["x-auth-token"] = auth.getJwt(); //calling protected APIendpoint
//but got bi directional dependencies

axios.interceptors.response.use(null, (error) => {
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500;

  if (expectedError) {
    console.log(error.data);
    alert(error.response.error);
  } else if (error.response.status == 500) {
  } else if (!expectedError) {
    alert("An unexpected error occurred. Please check with server");
  }

  return Promise.reject(error);
});

// function setJwt(jwt) {
//   axios.defaults.headers.common["x-auth-token"] = jwt;
// }

export default {
  get: axios.get,
  post: axios.post,
  put: axios.put,
  delete: axios.delete,
};
