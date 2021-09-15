import React, { Component } from "react";
import * as accountService from "../../services/accountService";

class ViewAccounts extends Component {
  state = {
    accounts: [],
    columns: [
      "Account ID",
      "Account Balance",
      "Account Type",
      "Customer ID",
      "Open Date",
    ],
  };

  componentDidMount() {
    this.retrieveAccounts();
  }

  retrieveAccounts = () => {
    accountService
      .getAll()
      .then((response) => {
        this.setState({
          accounts: response.data,
          columns: this.state.columns,
        });
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
    console.log(
      "Accounts retrieved in retrieveAccounts() JS function " +
        this.state.accounts
    );
  };
  render() {
    const { role } = this.props;
    if (role === "CUSTOMER") {
      return <div>Sorry, this is only available to Bank Admin</div>;
    } else if (role === "ADMIN" && this.state.accounts.length === 0) {
      return <div>There are no transactions in the database.</div>;
    } else {
      return (
        <div>
          <h2>View All Accounts</h2>
          <hr/>
          <table className="container">
            <thead>
              <tr>
                {this.state.columns.map((column) => (
                  <th className="clickable" key={column}>
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {this.state.accounts.map((account) => (
                <tr key={account.accountId}>
                  <td key={account.accountId}>{account.accountId}</td>
                  <td key={account.accountBalance}>{account.accountBalance}</td>
                  <td key={account.accountType}>{account.accountType}</td>
                  <td key={account.customerId}>{account.customerId}</td>
                  <td key={account.openDate}>{account.openDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }
  }
}

export default ViewAccounts;
