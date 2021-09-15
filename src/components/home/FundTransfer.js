import React, { Component } from "react";
import * as payeeService from "../../services/payeeService";
import * as accountService from "../../services/accountService";
import * as fundTransferService from "../../services/fundTransferService";
import auth from "../../services/authService";
import Joi from "joi-browser";

class FundTransfer extends Component {
  state = {
    PayeeDetails: [],
    data: { amount: null, payeeAcctId: null },
    errors: {},
  };

  componentDidMount() {
    this.retrievePayee();
  }

  retrievePayee = async () => {
    const accountId = await accountService.getAccountIds(
      auth.getCurrentUserId()
    );
    //console.log(accountId);
    //console.log(accountId.data);
    payeeService
      .findPayees(accountId.data)
      .then((response) => {
        this.setState({
          PayeeDetails: response.data,
          errors: {},
        });
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
    console.log(
      "Payee Details retrieved in retrievePayee() JS function " +
        this.state.PayeeDetails
    );
  };

  schema = {
    amount: Joi.number().required().label("Amount"),
    payeeAcctId: Joi.string().required().label("PayeeAcctId"),
  };

  ////////////////////////////////FOR TEXTFIELDS
  validateProperty = (input) => {
    const obj = { [input.name]: input.value };
    const schema = { [input.name]: this.schema[input.name] };
    const result = Joi.validate(obj, schema);

    if (!result.error) return null;
    else return result.error.details[0].message;
  };

  handleChange = (e) => {
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(e.currentTarget);
    if (errorMessage) errors[e.currentTarget.name] = errorMessage;
    else delete errors[e.currentTarget.name];

    const data = { ...this.state.data };
    data[e.currentTarget.name] = e.currentTarget.value;

    this.setState({ data, errors });
  };

  ////////////////////////////////FOR SUBMIT BUTTON
  validate = () => {
    const options = { abortEarly: false };
    const result = Joi.validate(this.state.data, this.schema, options);
    if (!result.error) return null;

    const errors = {};
    for (let item of result.error.details) errors[item.path[0]] = item.message;
    return errors;
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const errors = this.validate();
    this.setState({ errors: errors || {} }); //if got error, set to error, if no error, set to empty object
    if (errors) return;

    this.doSubmit();
  };

  doSubmit = async () => {
    try {
      const accountId = await accountService.getAccountIds(
        auth.getCurrentUserId()
      );
      await fundTransferService.populateFunds(
        {
          payeeAcctId: this.state.data.payeeAcctId,
          amount: this.state.data.amount,
        },
        accountId.data
      );
      window.location = "/";
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        console.log(ex.response + " " + ex.responsestatus);
        const errors = { ...this.state.errors };
        errors.username = ex.response.data;
        this.setState({ errors });
      } else if (ex.response && ex.response.status === 500) {
        console.log(ex.response);
        alert(ex.response.data.message);
      }
    }
  };

  render() {
    return (
      <div>
        <h4>Fund Transfer</h4>
        <form onSubmit={this.handleSubmit}>
          <label htmlFor="payeeAcctId">Select the payee account number</label>
          <br />
          <select
            name="payeeAcctId"
            className="form-select"
            id="payeeAcctId"
            value={this.state.data.payeeAcctId}
            onChange={this.handleChange}
            options={this.state.PayeeDetails}
          >
            <option value="" />
            {this.state.PayeeDetails.map((Payee) => (
              <option key={Payee.payeeAccountID} value={Payee.payeeAccountID}>
                {Payee.payeeAccountID} - {Payee.nickname}
              </option>
            ))}
          </select>
          {this.state.errors.payeeAcctId && (
            <div className="alert alert-danger">
              {this.state.errors.payeeAcctId}
            </div>
          )}

          <label htmlFor="amount">Key in the Amount:</label>
          <input
            name="amount"
            type="number"
            className="form-control"
            id="amount"
            value={this.state.data.amount}
            onChange={this.handleChange}
          />
          {this.state.errors.amount && (
            <div className="alert alert-danger">{this.state.errors.amount}</div>
          )}
          <div className="input-group-append">
            <button disabled={this.validate()} className="btn btn-primary">
              Submit
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default FundTransfer;
