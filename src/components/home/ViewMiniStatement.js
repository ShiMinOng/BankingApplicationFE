import React, { Component } from "react";
import auth from "../../services/authService";
import * as transactionsService from "../../services/transactionsService";
import * as accountService from "../../services/accountService";

class ViewMiniStatement extends React.Component {
  state = {
    statements: [],
    columns: [
      "Transaction ID",
      "Trans Description",
      "Date of Transaction",
      "Transaction Type",
      "Transaction Amount",
      "AccountID",
    ],
  };

  componentDidMount() {
    this.retrieveStatements();
  }

  retrieveStatements = async () => {
    const array = await accountService.getAccountIds(auth.getCurrentUserId());
    // console.log(array.data);
    transactionsService
      .getAllByAccountId(array.data)
      .then((response) => {
        this.setState({
          // statements: response.data.slice(-1),
          statements: response.data.slice(-10),
          columns: this.state.columns,
        });
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
    console.log(
      "Statements retrieved in retrieveStatements() JS function " +
        this.state.statements
    );
  };

  render() {
    const { role } = this.props;
    if (role === "ADMIN") {
      return <div>Sorry, this is only available to Customer</div>;
    } else if (role === "CUSTOMER" && this.state.statements.length === 0) {
      return <div>There are no statements in the database.</div>;
    }
    return (
      <div className="container">
        <h3>
          {auth.getCurrentCustomerName()}'s Mini Transaction Statements 
        </h3><hr/>
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
            {this.state.statements.map((statement) => (
              <tr key={statement.id}>
                <td key={statement.id}>{statement.id}</td>
                <td key={statement.description}>{statement.description}</td>
                <td key={statement.transDate}>{statement.transDate}</td>
                <td key={statement.trans_type}>{statement.trans_type}</td>
                <td key={statement.amount}>{statement.amount}</td>
                <td key={statement.accountId}>{statement.accountId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default ViewMiniStatement;
