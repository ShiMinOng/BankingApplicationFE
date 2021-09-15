import React, { Component } from "react";
import auth from "../../services/authService";
import * as userService from "../../services/userService";

class LogoutComponent extends Component {
  async componentDidMount() {
    try {
      await userService.logout();
      window.location = "/";
    } catch (ex) {}
    auth.logout();
    window.location = "/login";
  }
  render() {
    return null;
  }
}

export default LogoutComponent;
