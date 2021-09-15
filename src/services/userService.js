import http from "./httpService";
// import config from "../config.json";

const apiEndpoint = "http://localhost:7777";

export function login(user) {
  return http.post(apiEndpoint + "/login", {
    username: user.username,
    loginPassword: user.loginPassword,
  });
}

export function changePassword(userid, password) {
  return http.put(apiEndpoint + `/users/${userid}`, {
    loginPassword: password,
  });
}

export function logout() {
  return http.put(apiEndpoint + "/logout");
}
