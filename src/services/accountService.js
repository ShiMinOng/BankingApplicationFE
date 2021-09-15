import http from "./httpService";

const apiEndpoint = "http://localhost:7777";

export function getAll() {
  return http.get(apiEndpoint + "/accounts");
}

export function getAccountIds(userid) {
  return http.get(apiEndpoint + `/accounts/user/${userid}`);
}

export function getBalance(userid) {
  return http.get(apiEndpoint + `/accounts/${userid}`);
}
