import React, { Component } from "react";
import Joi from "joi-browser";
import * as userService from "../../services/userService";
import * as customerService from "../../services/customerService";
import auth from "../../services/authService";
import { Redirect } from "react-router";
import logo from "../../img/logo.png";

class LoginComponent extends Component {
  state = {
    data: { username: "", loginPassword: "" },
    errors: {},
  };

  schema = {
    username: Joi.string().required().min(3).label("Username"),
    loginPassword: Joi.string().required().min(5).label("Password"),
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
      const result = await userService.login(this.state.data);
      const userid = result.data.userId;
      const role = result.data.role;
      console.log("userId: " + userid);
      console.log("role: " + role);
      if(role == "ADMIN"){
        await auth.login(userid, "", role);
      }
      else{
        const result2 = await customerService.getAddressAndEmail(userid);
        const customername = result2.data.customerName;
        await auth.login(userid, customername, role);
      }
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
      } else if (ex.response && ex.response.status === 500) {
        console.log(ex.response);
        alert(ex.response.data.message);
      }
    }
  };

  ///////////////////////////////////////////OWN CUSTOM METHODS
  //   userName = (e) => {
  //     // console.log("inside searchName() " + this.state.searchName);
  //     const username = e.target.value;
  //     const loginPassword = this.state.data.loginPassword;
  //     this.setState({
  //       data: { username: username, loginPassword: loginPassword },
  //     });
  //   };

  //   passWord = (e) => {
  //     // console.log("inside searchName() " + this.state.searchName);
  //     const username = this.state.data.username;
  //     const loginPassword = e.target.value;
  //     this.setState({
  //       data: { username: username, loginPassword: loginPassword },
  //     });
  //   };

  render() {
    if (auth.getCurrentUserId()) return <Redirect to="/" />; //if user is logged in
    return (
      //if user is not logged in yet
      <div>
        <img src={logo}></img>
        <h2>Welcome to SoftraBank</h2>
        <i>Please login to proceed.</i>
        <br/><br/>
        <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <h3>Username:</h3>
            <input
              name="username"
              type="text"
              className="form-control"
              value={this.state.data.username}
              onChange={this.handleChange}
              label="Username"
            />
            {this.state.errors.username && (
              <div className="alert alert-danger">
                {this.state.errors.username}
              </div>
            )}
          </div>
          <br/>

          <div className="form-group">
            <h3>Password:</h3>
            <input
              name="loginPassword"
              type="password"
              className="form-control"
              value={this.state.data.loginPassword}
              onChange={this.handleChange}
              label="Password"
            />
            {this.state.errors.loginPassword && (
              <div className="alert alert-danger">
                {this.state.errors.loginPassword}
              </div>
            )}

            <br />
          </div>
          <div className="input-group-append">
            <button disabled={this.validate()} className="btn btn-primary">
              Login
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default LoginComponent;
