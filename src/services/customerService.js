import http from "./httpService";
// import config from "../config.json";

const apiEndpoint = "http://localhost:7777";

export function getAddressAndEmail(userid) {
  return http.get(apiEndpoint + `/customers/${userid}`);
}

export function changeAddressAndEmail(userid, object) {
  return http.put(apiEndpoint + `/customers/${userid}`, {
    radioBox: object.radiobox,
    email: object.email,
    address: object.address,
  });
}
