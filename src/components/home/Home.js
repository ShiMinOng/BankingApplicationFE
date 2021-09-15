import React, { Component } from "react";
import auth from "../../services/authService";
import * as accountService from "../../services/accountService";

class Home extends Component {
  state = {
    balance: null,
  };

  componentDidMount() {
    this.retrieveBalance();
  }

  retrieveBalance = () => {
    accountService
      .getBalance(auth.getCurrentUserId())
      .then((response) => {
        this.setState({
          balance: response.data,
        });
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
    console.log(
      "Balance retrieved in retrieveBalance() JS function " + this.state.balance
    );
  };

  render() {
    return (
      <div>
        <h3>Welcome, {" "}
          {auth.getCurrentCustomerName()}!</h3>
          <hr/>
        <h4>Your Current Balance is {this.state.balance}</h4>
      </div>
    );
  }
}

export default Home;
