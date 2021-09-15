import React, { Component } from "react";
import Joi from "joi-browser";
import * as userService from "../../services/userService";
import { Redirect } from "react-router";

class ChangePassword extends React.Component {
  state = {
    data: { password: "" },
    errors: {},
  };

  schema = {
    password: Joi.string().required().min(5).label("New Password"),
  };

  ////////////////////////////////FOR TEXTFIELDS
  validateProperty = (input) => {
    const obj = { [input.name]: input.value };
    const schema = { [input.name]: this.schema[input.name] };
    // console.log("Check2a");
    const result = Joi.validate(obj, schema);
    // console.log("Check2b");
    // console.log(result.error);
    if (!result.error) return null;
    else return result.error.details[0].message;
  };

  handleChange = (e) => {
    // console.log("Check1");
    const errors = { ...this.state.errors };
    // console.log("Check2");
    const errorMessage = this.validateProperty(e.currentTarget);
    // console.log("Check3");
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
      await userService.changePassword(
        this.props.userid,
        this.state.data.password
      );
      console.log("Password has been changed");
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
    const { role } = this.props;
    if (role === "ADMIN") {
      return <div>Sorry, this is only available to Customer</div>;
    }
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="form-group">
          <h3>Change Login Password</h3>
          <i>Password needs to be at least 5 characters long.</i>
          <hr/>
          <h5>New Password:</h5>
          <input
            name="password"
            type="password"
            className="form-control"
            value={this.state.data.password}
            onChange={this.handleChange}
            label="New Password"
          />
          {this.state.errors.password && (
            <div className="alert alert-danger">
              {this.state.errors.password}
            </div>
          )}
        </div><br/>
        <div className="input-group-append">
          <button disabled={this.validate()} className="btn btn-primary">
            Confirm
          </button>
        </div>
      </form>
    );
  }
}

export default ChangePassword;
