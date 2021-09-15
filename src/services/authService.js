// const tokenKey = "userid";

export async function login(userid, customername, role) {
  localStorage.setItem("userid", userid);
  localStorage.setItem("customername", customername);
  localStorage.setItem("role", role);
}

// export function loginWithJwt(jwt) {
//   //from registerform
//   localStorage.setItem(tokenKey, jwt);
// }

export function logout() {
  localStorage.removeItem("userid");
  localStorage.removeItem("role");
}

export function getCurrentUserId() {
  try {
    const userid = localStorage.getItem("userid");
    return userid;
  } catch (ex) {
    return null;
  }
}

export function getCurrentCustomerName() {
  try {
    const customername = localStorage.getItem("customername");
    return customername;
  } catch (ex) {
    return null;
  }
}

export function getCurrentUserRole() {
  try {
    const role = localStorage.getItem("role");
    return role;
  } catch (ex) {
    return null;
  }
}

export default {
  //aka 'auth'
  login,
  logout,
  getCurrentUserId,
  getCurrentCustomerName,
  getCurrentUserRole,
};
