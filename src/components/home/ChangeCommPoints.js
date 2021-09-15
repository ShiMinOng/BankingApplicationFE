import React, { Component } from "react";
import * as customerService from "../../services/customerService";
import auth from "../../services/authService";
import Joi from "joi-browser";

class ChangeCommPoints extends Component {
  state = {
    data: { radiobox: "", address: "", email: "" },
    previousData: { address: "", email: "" },
    errors: {},
  };

  schema = {
    radiobox: Joi.string().required().label("Radiobox"),
    address: Joi.string().required().min(5).label("New Address"),
    email: Joi.string().required().min(5).email().label("New Email"),
  };

  schema2 = {
    address: Joi.string().required().min(5).label("New Address"),
  };

  schema3 = {
    email: Joi.string().required().min(5).email().label("New Email"),
  };

  componentDidMount() {
    this.retrieveAddressAndEmail();
  }

  retrieveAddressAndEmail = () => {
    customerService
      .getAddressAndEmail(auth.getCurrentUserId())
      .then((response) => {
        this.setState({
          data: { address: response.data.address, email: response.data.email },
          previousData: {
            address: response.data.address,
            email: response.data.email,
          },
        });
      })
      .catch((e) => {
        console.log(e);
      });
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
    console.log("Inside 1");
    const result = Joi.validate(this.state.data, this.schema, options);
    if (!result.error) return null;

    const errors = {};
    for (let item of result.error.details) errors[item.path[0]] = item.message;
    return errors;
  };

  validate2 = () => {
    const options = { abortEarly: false };
    const result = Joi.validate(
      { address: this.state.data.address },
      this.schema2,
      options
    );
    if (!result.error) return null;

    const errors = {};
    for (let item of result.error.details) errors[item.path[0]] = item.message;
    return errors;
  };

  validate3 = () => {
    const options = { abortEarly: false };
    const result = Joi.validate(
      { email: this.state.data.email },
      this.schema3,
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
    if (this.state.data.radiobox === "one") {
      errors = this.validate();
    } else if (this.state.data.radiobox === "two") {
      errors = this.validate2();
    } else {
      errors = this.validate3();
    }
    // const errors = this.validate();
    this.setState({ errors: errors || {} }); //if got error, set to error, if no error, set to empty object
    if (errors) return;

    this.doSubmit();
  };

  doSubmit = async () => {
    try {
      await customerService.changeAddressAndEmail(
        this.props.userid,
        this.state.data
      );
      console.log("Address and email have been changed");
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
    const { role } = this.props;
    if (role === "ADMIN") {
      return <div>Sorry, this is only available to Customer</div>;
    } else {
      return (
        <div>
          <div>
            <h3>Current Address: {this.state.previousData.address}</h3>
            <h3>Current Email: {this.state.previousData.email}</h3>
          </div><hr/>
          <form onSubmit={this.handleSubmit}>
            <div>
              <input
                type="radio"
                id="ae"
                name="radiobox"
                value="one"
                onChange={this.handleChange}
              />
                <label htmlFor="ae">Change Both Address and Email</label>
              <br /> {" "}
              <input
                type="radio"
                id="a"
                name="radiobox"
                value="two"
                onChange={this.handleChange}
              />
                <label htmlFor="a">Change Address Only</label>
              <br /> {" "}
              <input
                type="radio"
                id="e"
                name="radiobox"
                value="three"
                onChange={this.handleChange}
              />
                <label htmlFor="e">Change Email Only</label>
            </div>
            {this.state.data.radiobox === "one" && (
              <div>
                <div className="form-group col-md-12">
                  <label htmlFor="address">Change Address</label>
                  <input
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
                </div>
                <div className="form-group col-md-12">
                  <label htmlFor="email">Change Email</label>
                  <input
                    name="email"
                    type="text"
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
                </div>
                <div className="input-group-append">
                  <button
                    disabled={this.validate()}
                    className="btn btn-primary"
                  >
                    Change
                  </button>
                </div>
              </div>
            )}
            {this.state.data.radiobox === "two" && (
              <div>
                <div className="form-group col-md-12">
                  <label htmlFor="address">Change Address</label>
                  <input
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
                </div>
                <div className="input-group-append">
                  <button
                    disabled={this.validate2()}
                    className="btn btn-primary"
                  >
                    Change
                  </button>
                </div>
              </div>
            )}
            {this.state.data.radiobox === "three" && (
              <div>
                <div className="form-group col-md-12">
                  <label htmlFor="email">Change Email</label>
                  <input
                    name="email"
                    type="text"
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
                </div>
                <div className="input-group-append">
                  <button
                    disabled={this.validate3()}
                    className="btn btn-primary"
                  >
                    Change
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      );
    }
  }
}

export default ChangeCommPoints;
