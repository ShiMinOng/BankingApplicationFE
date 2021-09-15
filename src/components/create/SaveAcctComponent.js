import React, { Component } from "react";
import * as BankDataService from "../../services/bankService";
import "../../App.css";
import Joi from "joi-browser";

class SaveAcctComponent extends Component {
  state = {
    data: {
      username: "",
      loginPassword: "",
      secretQuestion: "",
      transactionPassword: "",
      lockStatus: false,
      role: "CUSTOMER",
      customerName: "",
      email: "",
      address: "",
      accountType: "Savings",
      accountBalance: null,
    },
    errors: {},
    // data2: {
    //   username: "",
    //   loginPassword: "",
    //   secretQuestion: "",
    //   transactionPassword: "",
    //   lockStatus: false,
    //   role: "CUSTOMER",
    // },
  };

  schema = {
    username: Joi.string().required().min(3).label("Username"),
    loginPassword: Joi.string().required().min(5).label("Password"),
    secretQuestion: Joi.string().required().label("Secret Question"),
    transactionPassword: Joi.string()
      .required()
      .min(5)
      .label("Transaction Password"),
    lockStatus: Joi.boolean().label("Lock Status"),
    role: Joi.string().required(),
    customerName: Joi.string().required().min(5).label("Customer Name"),
    email: Joi.string().required().min(5).email().label("Email"),
    address: Joi.string().required().min(5).label("Address"),
    accountType: Joi.string().required(),
    accountBalance: Joi.number().precision(2).min(0).required().label("Account Balance"),
  };

  schema2 = {
    username: Joi.string().required().min(3).label("Username"),
    loginPassword: Joi.string().required().min(5).label("Password"),
    secretQuestion: Joi.string().required().label("Secret Question"),
    transactionPassword: Joi.string()
      .required()
      .min(5)
      .label("Transaction Password"),
    role: Joi.string().required(),
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

  validate2 = () => {
    const options = { abortEarly: false };
    const result = Joi.validate(
      {
        username: this.state.data.username,
        loginPassword: this.state.data.loginPassword,
        secretQuestion: this.state.data.secretQuestion,
        transactionPassword: this.state.data.transactionPassword,
        role: this.state.data.role,
      },
      this.schema2,
      options
    );
    if (!result.error) return null;

    const errors = {};
    for (let item of result.error.details) errors[item.path[0]] = item.message;
    return errors;
  };

  handleSubmit = (e) => {
    e.preventDefault();
    var errors;
    if (this.state.data.role === "ADMIN") {
      errors = this.validate2();
    } else {
      errors = this.validate();
    }
    // const errors = this.validate();
    this.setState({ errors: errors || {} }); //if got error, set to error, if no error, set to empty object
    if (errors) return;

    this.doSubmit();
  };

  doSubmit = async () => {
    try {
      const user = this.state.data;
      const userrr = await BankDataService.create(user);
      //////Alert messages can be put here before redirecting to home page
      console.log(userrr);
      window.location = "/";

      /////////////extra things (to redirect to previous page)
      // const { state } = this.props.location;
      // window.location = state ? state.from.pathname : "/";
      // this.props.history.push("/");
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        console.log(ex.response + " " + ex.responsestatus);
        const errors = { ...this.state.errors };
        errors.username = ex.response.data;
        this.setState({ errors });
      }
    }
  };

  render() {
    return (
      <div className="create">
        <h2>Create New User Account</h2>
        <hr/>
        <div className="form mx-5">
          <form onSubmit={this.handleSubmit}>
            <div className="form-group row">
              <div className="form-group col-md-6">
                <label htmlFor="username">Username</label>
                <input
                  name="username"
                  type="text"
                  className="form-control"
                  id="username"
                  value={this.state.data.username}
                  onChange={this.handleChange}
                />
                {this.state.errors.username && (
                  <div className="alert alert-danger">
                    {this.state.errors.username}
                  </div>
                )}
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="loginPassword">Login Password</label>
                <input
                  name="loginPassword"
                  type="password"
                  className="form-control"
                  id="loginPassword"
                  value={this.state.data.loginPassword}
                  onChange={this.handleChange}
                />
                {this.state.errors.loginPassword && (
                  <div className="alert alert-danger">
                    {this.state.errors.loginPassword}
                  </div>
                )}
                {/* <br /> */}
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="secretQuestion">Secret Question</label>
              <textarea
                name="secretQuestion"
                type="text"
                className="form-control"
                id="secretQuestion"
                value={this.state.data.secretQuestion}
                onChange={this.handleChange}
              />
              {this.state.errors.secretQuestion && (
                <div className="alert alert-danger">
                  {this.state.errors.secretQuestion}
                </div>
              )}
              {/* <br /> */}
            </div>
            <div className="form-group row">
              <div className="form-group col-md-6">
                <label htmlFor="transactionPassword">
                  Transaction Password
                </label>
                <input
                  name="transactionPassword"
                  type="password"
                  className="form-control"
                  id="transactionPassword"
                  value={this.state.data.transactionPassword}
                  onChange={this.handleChange}
                />
                {this.state.errors.transactionPassword && (
                  <div className="alert alert-danger">
                    {this.state.errors.transactionPassword}
                  </div>
                )}
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="role">Role</label>
                <br />
                <select
                  name="role"
                  className="form-select"
                  id="role"
                  value={this.state.data.role}
                  onChange={this.handleChange}
                >
                  <option value="CUSTOMER">Customer</option>
                  <option value="ADMIN">Administrator</option>
                </select>
              </div>
              {/* <div className="form-group col-md-2">
                <label htmlFor="lockStatus">Lock Status</label> <br />
                <input type="hidden" id="lockStatus" value="false" />
                <input
                  name="lockStatus"
                  type="checkbox"
                  id="lockStatus"
                  value="true"
                  onChange={this.lockStatus}
                />{" "}
                Locked
                <br />
                <br />
              </div> */}
            </div>
            {this.state.data.role === "ADMIN" && (
              <React.Fragment>
                <br />
                <div className="input-group-append">
                  <button
                    disabled={this.validate2()}
                    className="btn btn-primary"
                  >
                    Create
                  </button>
                </div>
              </React.Fragment>
            )}
            {this.state.data.role === "CUSTOMER" && (
              <React.Fragment>
                <div className="form-group">
                  <label htmlFor="customerName">Customer Name</label>
                  <input
                    name="customerName"
                    type="text"
                    className="form-control"
                    id="customerName"
                    value={this.state.data.customerName}
                    onChange={this.handleChange}
                  />
                  {this.state.errors.customerName && (
                    <div className="alert alert-danger">
                      {this.state.errors.customerName}
                    </div>
                  )}
                  {/* <br /> */}
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    name="email"
                    type="email"
                    className="form-control"
                    id="email"
                    value={this.state.data.email}
                    onChange={this.handleChange}
                  />
                  {this.state.errors.email && (
                    <div className="alert alert-danger">
                      {this.state.errors.email}
                    </div>
                  )}
                  {/* <br /> */}
                </div>
                <div className="form-group">
                  <label htmlFor="address">Address</label>
                  <textarea
                    name="address"
                    type="text"
                    className="form-control"
                    id="address"
                    value={this.state.data.address}
                    onChange={this.handleChange}
                  />
                  {this.state.errors.address && (
                    <div className="alert alert-danger">
                      {this.state.errors.address}
                    </div>
                  )}
                  {/* <br /> */}
                </div>
                <div className="form-group row">
                  <div className="form-group col-md-6">
                    <label htmlFor="accountType">Account Type</label>
                    <br />
                    <select
                      name="accountType"
                      className="form-select"
                      id="accountType"
                      value={this.state.data.accountType}
                      onChange={this.handleChange}
                    >
                      <option value="Savings">Savings</option>
                      <option value="Fixed Deposit">Fixed Deposit</option>
                    </select>
                  </div>
                  <div className="form-group col-md-6">
                    <label htmlFor="accountBalance">Opening Balance</label>
                    <input
                      name="accountBalance"
                      type="number"
                      className="form-control"
                      id="accountBalance"
                      min="0"
                      step="0.01"
                      value={this.state.data.accountBalance}
                      onChange={this.handleChange}
                    />
                    {this.state.errors.accountBalance && (
                      <div className="alert alert-danger">
                        {this.state.errors.accountBalance}
                      </div>
                    )}
                    <br />
                  </div>
                </div>
                <div className="input-group-append">
                  <div className="form-group col-md-12 text-center">
                    <div className="input-group-append">
                      <button
                        disabled={this.validate()}
                        className="btn btn-primary"
                      >
                        Create
                      </button>
                    </div>
                  </div>
                </div>
              </React.Fragment>
            )}
            {/* <button
                  type="button"
                  className="btn btn-primary btn-lg my-1"
                  value="Submit"
                  onClick={this.doSubmit}
                >
                  Submit
                </button> */}
            {/*  */}
            {/*  */}
          </form>
        </div>
      </div>
    );
  }
}

export default SaveAcctComponent;
