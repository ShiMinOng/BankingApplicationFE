import React, { Component } from "react";
import { Link, NavLink } from "react-router-dom";

const NavBar = ({ userid, role }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          SoftraBank
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <div className="navbar-nav">
            {!userid && (
              <NavLink className="nav-link active" to="/login">
                Login
              </NavLink>
            )}
            {userid && role == "ADMIN" && (
              <React.Fragment>
                <NavLink className="nav-link" to="/users">
                  Account Creation
                </NavLink>
                <NavLink className="nav-link" to="/viewaccounts">
                  View Accounts
                </NavLink>
                <NavLink className="nav-link" to="/viewtransactions">
                  View Transactions
                </NavLink>
                <NavLink className="nav-link" to="/services">
                  Services
                </NavLink>
                <NavLink className="nav-link" to="/logout">
                  Logout
                </NavLink>
              </React.Fragment>
            )}
            {userid && role == "CUSTOMER" && (
              <React.Fragment>
                <NavLink className="nav-link" to="/">
                  Home
                </NavLink>
                <NavLink className="nav-link" to="/viewministatement">
                  View Mini Statement
                </NavLink>
                <NavLink className="nav-link" to="/viewdetailedstatement">
                  View Detailed Statement
                </NavLink>
                <NavLink className="nav-link" to="/changepassword">
                  Change Password
                </NavLink>
                <NavLink className="nav-link" to="/changecommpoints">
                  Change Comm Points
                </NavLink>
                <NavLink className="nav-link" to="/services">
                  Services
                </NavLink>
                <NavLink className="nav-link" to="/addpayee">
                  Add Payee
                </NavLink>
                <NavLink className="nav-link" to="/fundtransfer">
                  Fund Transfer
                </NavLink>
                <NavLink className="nav-link" to="/logout">
                  Logout
                </NavLink>
              </React.Fragment>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
