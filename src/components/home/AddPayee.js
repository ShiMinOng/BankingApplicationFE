import React, { Component } from "react";
import Joi from "joi-browser";
import * as payeeService from "../../services/payeeService";
import * as accountService from "../../services/accountService";
import auth from "../../services/authService";

class AddPayee extends Component {
  state = {
    data: { payeeAcctId: null, nickname: "" },
    errors: {},
  };

  schema = {
    payeeAcctId: Joi.number().required().label("Payee Account ID"),
    nickname: Joi.string().required().min(3).label("Nickname"),
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
      await payeeService.addPayee({
        accountId: accountId.data,
        payeeAcctId: this.state.data.payeeAcctId,
        nickname: this.state.data.nickname,
      });
      window.location = "/";
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        console.log(ex.response + " " + ex.responsestatus);
        const errors = { ...this.state.errors };
        errors.username = ex.response.data;
        this.setState({ errors });
      }  else if (ex.response && ex.response.status === 500) {
        console.log(ex.response);
        alert(ex.response.data.message);
      }
    }
  };

  render() {
    return (
      <div>
        <h2>Add a new Payee</h2>
        <hr/>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="payeeAcctId">Payee Account ID</label>
            <input
              name="payeeAcctId"
              id="payeeAcctId"
              type="number"
              className="form-control"
              value={this.state.data.payeeAcctId}
              onChange={this.handleChange}
              label="PayeeAcctId"
            />
            {this.state.errors.payeeAcctId && (
              <div className="alert alert-danger">
                {this.state.errors.payeeAcctId}
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="nickname">Nickname</label>
            <input
              name="nickname"
              id="nickname"
              type="text"
              className="form-control"
              value={this.state.data.nickname}
              onChange={this.handleChange}
              label="Nickname"
            />
            {this.state.errors.nickname && (
              <div className="alert alert-danger">
                {this.state.errors.nickname}
              </div>
            )}

            <br />
          </div>
          <div className="input-group-append">
            <button disabled={this.validate()} className="btn btn-primary">
              Add Payee
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default AddPayee;
