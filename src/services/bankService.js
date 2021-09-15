import http from "./httpService";

const apiEndpoint = "http://localhost:7777";

export function create(user) {
  console.log(user);
  return http.post(apiEndpoint + "/users", {
    username: user.username,
    loginPassword: user.loginPassword,
    secretQuestion: user.secretQuestion,
    transactionPassword: user.transactionPassword,
    lockStatus: user.lockStatus,
    role: user.role,
    customerName: user.customerName,
    email: user.email,
    address: user.address,
    accountType: user.accountType,
    accountBalance: user.accountBalance,
  });
}
