import logo from "./logo.svg";
import "./App.css";
import React, { Component } from "react";

import NavBar from "./components/NavBarComponent";
import { Route, Redirect, Switch } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import auth from "./services/authService";

import LoginComponent from "./components/login/LoginComponent";
import LogoutComponent from "./components/login/LogoutComponent";

import ViewTransactions from "./components/home/ViewTransactions";
import SaveAcctComponent from "./components/create/SaveAcctComponent";
import ViewAccounts from "./components/home/ViewAccounts";

import Home from "./components/home/Home";
import ViewMiniStatement from "./components/home/ViewMiniStatement";
import ViewDetailedStatement from "./components/home/ViewDetailedStatement";
import ChangePassword from "./components/home/ChangePassword";
import ChangeCommPoints from "./components/home/ChangeCommPoints";
import ServiceTrackerComponent from "./components/service-tracker/ServiceTrackerComponent";
import AddPayee from "./components/home/AddPayee";
import FundTransfer from "./components/home/FundTransfer";

class App extends Component {
  state = { userid: null, role: "" };

  componentDidMount() {
    const userid = auth.getCurrentUserId();
    const role = auth.getCurrentUserRole();
    // console.log("Second: " + id);
    this.setState({ userid: userid, role: role });
    // console.log("Third: " + id);
  }

  render() {
    return (
      <React.Fragment>
        <div className="App background-image">
          <ToastContainer />
          <NavBar userid={this.state.userid} role={this.state.role} />
          <div className="body">
            <div className="container">
              <Switch>
                {/* Already have Redirect inside LoginComponent itself*/}
                <Route path="/login" component={LoginComponent} />
                <Route
                  path="/logout"
                  render={(props) => {
                    if (!auth.getCurrentUserId())
                      return <Redirect to="/login" />;
                    else return <LogoutComponent />;
                  }}
                />
                <Route
                  path="/users"
                  render={(props) => {
                    if (!auth.getCurrentUserId())
                      return <Redirect to="/login" />;
                    else
                      return (
                        <SaveAcctComponent
                          {...props}
                          userid={this.state.userid}
                          role={this.state.role}
                        />
                      );
                  }}
                />
                {/* <Route
                  path="/createaccount"
                  render={(props) => {
                    if (!auth.getCurrentUserId()) return <Redirect to="/login" />;
                    else
                      return (
                        <CreateAccount
                          {...props}
                          userid={this.state.userid}
                          role={this.state.role}
                        />
                      );
                  }}
                /> */}
                <Route //for reference only (Conditional rendering for Redirect)
                  path="/viewtransactions"
                  render={(props) => {
                    if (!auth.getCurrentUserId())
                      return <Redirect to="/login" />;
                    else
                      return (
                        <ViewTransactions {...props} role={this.state.role} />
                      );
                  }}
                />
                <Route //for reference only (Conditional rendering for Redirect)
                  path="/changepassword"
                  render={(props) => {
                    if (!auth.getCurrentUserId())
                      return <Redirect to="/login" />;
                    else
                      return (
                        <ChangePassword
                          {...props}
                          userid={this.state.userid}
                          role={this.state.role}
                        />
                      );
                  }}
                />
                <Route
                  path="/changecommpoints"
                  render={(props) => {
                    if (!auth.getCurrentUserId())
                      return <Redirect to="/login" />;
                    else
                      return (
                        <ChangeCommPoints
                          {...props}
                          userid={this.state.userid}
                          role={this.state.role}
                        />
                      );
                  }}
                />
                <Route
                  path="/viewaccounts"
                  render={(props) => {
                    if (!auth.getCurrentUserId())
                      return <Redirect to="/login" />;
                    else
                      return (
                        <ViewAccounts
                          {...props}
                          userid={this.state.userid}
                          role={this.state.role}
                        />
                      );
                  }}
                />
                <Route
                  path="/viewministatement"
                  render={(props) => {
                    if (!auth.getCurrentUserId())
                      return <Redirect to="/login" />;
                    else
                      return (
                        <ViewMiniStatement
                          {...props}
                          userid={this.state.userid}
                          role={this.state.role}
                        />
                      );
                  }}
                />
                <Route
                  path="/viewdetailedstatement"
                  render={(props) => {
                    if (!auth.getCurrentUserId())
                      return <Redirect to="/login" />;
                    else
                      return (
                        <ViewDetailedStatement
                          {...props}
                          userid={this.state.userid}
                          role={this.state.role}
                        />
                      );
                  }}
                />
                <Route
                  path="/services"
                  render={(props) => {
                    if (!auth.getCurrentUserId())
                      return <Redirect to="/login" />;
                    else
                      return (
                        <ServiceTrackerComponent
                          {...props}
                          userid={this.state.userid}
                          role={this.state.role}
                        />
                      );
                  }}
                />
                <Route
                  path="/addpayee"
                  render={(props) => {
                    if (!auth.getCurrentUserId())
                      return <Redirect to="/login" />;
                    else
                      return (
                        <AddPayee
                          {...props}
                          userid={this.state.userid}
                          role={this.state.role}
                        />
                      );
                  }}
                />
                <Route
                  path="/fundtransfer"
                  render={(props) => {
                    if (!auth.getCurrentUserId())
                      return <Redirect to="/login" />;
                    else
                      return (
                        <FundTransfer
                          {...props}
                          userid={this.state.userid}
                          role={this.state.role}
                        />
                      );
                  }}
                />
                {/* Another */}
                <Route
                  path="/"
                  render={(props) => {
                    if (!auth.getCurrentUserId())
                      return <Redirect to="/login" />;
                    else if (auth.getCurrentUserRole() == "ADMIN") {
                      return <Redirect to="/users" />;
                    } else
                      return (
                        <Home
                          {...props}
                          userid={this.state.userid}
                          role={this.state.role}
                        />
                      );
                  }}
                />
              </Switch>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default App;
