import React, { Component } from "react";
import * as transactionsService from "../../services/transactionsService";

class ViewTransactions extends Component {
  state = {
    transactions: [],
    input: null,
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
    this.retrieveTransactions();
  }

  onChange = (e) => {
    console.log("inside onChange()");
    const input = e.target.value;
    console.log("input value: " + input);
    this.setState({
      input: input
    });
  }

  retrieveTransactions = () => {
    transactionsService
      .getAll()
      .then((response) => {
        this.setState({
          transactions: response.data,
          columns: this.state.columns,
        });
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
    console.log(
      "Transactions retrieved in retrieveTransactions() JS function " +
        this.state.transactions
    );
  };

  retrieveTransactionsByMonth = () => {
    transactionsService
      .getAllByMonth(this.state.input)
      .then((response) => {
        this.setState({
          transactions: response.data,
          columns: this.state.columns,
        });
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
      console.log("Transactions retrieved from retrieveTransactionsByMonth() "+ this.state.transactions);
  };

  retrieveTransactionsByYear = () => {
    transactionsService
      .getAllByYear(this.state.input)
      .then((response) => {
        this.setState({
          transactions: response.data,
          columns: this.state.columns,
        });
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
      console.log("Transactions retrieved from retrieveTransactionsByYear() "+ this.state.transactions);
  };

  render() {
    const { role } = this.props;
    if (role === "CUSTOMER") {
      return <div>Sorry, this is only available to Bank Admin</div>;
    } else if (role === "ADMIN" && this.state.transactions.length === 0) {
      return (
        <div>
           <div className="mt-3">
          <span>
            <input type="number"
              className="form-control"
              placeholder="Search by month or year"
              value={this.state.input}
              onChange={this.onChange}
            />
          </span>
          <div className="m-3">
            <button className="btn btn-outline-secondary" type="button" onClick={this.retrieveTransactions}>Daily</button>
            <button className="btn btn-outline-secondary" type="button" onClick={this.retrieveTransactionsByMonth}>Monthly</button>
            <button className="btn btn-outline-secondary"type="button" onClick={this.retrieveTransactionsByYear}>Yearly</button>
          </div>
        </div>
          There are no transactions in the database.
        </div>
      );
    }
    return (
      <div>
        <div className="mt-3">
          <span>
            <input type="number"
              className="form-control"
              placeholder="Search by month or year"
              value={this.state.input}
              onChange={this.onChange}
            />
          </span>
          <div className="m-3">
            <button className="btn btn-outline-secondary" type="button" onClick={this.retrieveTransactions}>Daily</button>
            <button className="btn btn-outline-secondary" type="button" onClick={this.retrieveTransactionsByMonth}>Monthly</button>
            <button className="btn btn-outline-secondary"type="button" onClick={this.retrieveTransactionsByYear}>Yearly</button>
          </div>
        </div>
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
            {this.state.transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td key={transaction.id}>{transaction.id}</td>
                <td key={transaction.description}>{transaction.description}</td>
                <td key={transaction.transDate}>{transaction.transDate}</td>
                <td key={transaction.trans_type}>{transaction.trans_type}</td>
                {/* ^ Wtf is with the json name */}
                <td key={transaction.amount}>{transaction.amount}</td>
                <td key={transaction.accountId}>{transaction.accountId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default ViewTransactions;
