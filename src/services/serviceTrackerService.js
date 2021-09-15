import http from "./httpService";

const apiEndpoint = "http://localhost:7777/services";

export function createRequest(req) {
  return http.post(apiEndpoint, {
    serviceDesc: req.serviceDesc,
    serviceRaiseDate: req.serviceRaiseDate,
    serviceStatus: req.serviceStatus,
    accountId: req.accountId,
  });
}

export function getAllRequests() {
  return http.get(apiEndpoint);
}

export function getOneRequest(reqId) {
  return http.get(apiEndpoint + `/${reqId}`);
}

export function changeReqStatus(req) {
  return http.put(apiEndpoint + "/status", {
    serviceStatus: req.serviceStatus,
    serviceId: req.serviceId,
  });
}

export function getAccountReq(accountId) {
  return http.get(apiEndpoint + `/account/${accountId}`);
}
