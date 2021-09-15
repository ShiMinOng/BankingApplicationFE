import http from "./httpService";
// import config from "../config.json";

const apiEndpoint = "http://localhost:7777";

export function addPayee(tgt) {
  return http.post(apiEndpoint + "/payees", {
    accountId: tgt.accountId,
    payeeAccountID: tgt.payeeAcctId,
    nickname: tgt.nickname,
  });
}

export function findPayees(id) {
  return http.get(apiEndpoint + `/payees/${id}`);
}
