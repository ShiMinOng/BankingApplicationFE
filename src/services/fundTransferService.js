import http from "./httpService";
// import config from "../config.json";

const apiEndpoint = "http://localhost:7777";

export function populateFunds(data, payerId) {
  console.log(data);
  return http.post(apiEndpoint + `/fundtransfer/${payerId}`, {
    payeeAccountId: data.payeeAcctId,
    amount: data.amount,
  });
}
