import http from "./httpService";
// import config from "../config.json";

const apiEndpoint = "http://localhost:7777/transactions";

export function getAll() {
  return http.get(apiEndpoint);
}

export function getAllByAccountId(accountid) {
  return http.get(apiEndpoint + `/accounts/${accountid}`);
}

export function getAllByMonth(month) {
  return http.get(apiEndpoint + `/month/${month}`);
}

export function getAllByYear(year) {
  return http.get(apiEndpoint + `/year/${year}`);
}