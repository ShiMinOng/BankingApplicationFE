import React, { Component } from "react";
import * as requestService from "../../services/serviceTrackerService";
import Joi from "joi-browser";

// component only available to customer
class CreateRequest extends Component {
  state = {
    data: {
      serviceDesc: "",
      serviceStatus: "PENDING",
      accountId: null,
    },
    errors: {},
  };

  schema = {
    serviceDesc: Joi.string().required().label("Service Description"),
    serviceStatus: Joi.string().label("Service Status"),
    accountId: Joi.number().integer().required().label("Account ID"),
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
      const req = this.state.data;
      const request = await requestService.createRequest(req);
      //////Alert messages can be put here before redirecting to home page
      console.log(request);
      alert("request submitted");
      window.location = "/";

      /////////////extra things (to redirect to previous page)
      // const { state } = this.props.location;
      // window.location = state ? state.from.pathname : "/";
      // this.props.history.push("/");
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        console.log(ex.response + " " + ex.responsestatus);
        const errors = { ...this.state.errors };
        //     errors.username = ex.response.data;
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
        <br />
        <form onSubmit={this.handleSubmit}>
          <div className="form-group row">
            <div className="form-group col-md-2"></div>
            <div className="form-group col-md-8">
              <label htmlFor="serviceDesc">Service Description</label>
              <textarea
                name="serviceDesc"
                type="text"
                className="form-control"
                id="serviceDesc"
                value={this.state.data.serviceDesc}
                onChange={this.handleChange}
              />
              {this.state.errors.serviceDesc && (
                <div className="alert alert-danger">
                  {this.state.errors.serviceDesc}
                </div>
              )}
            </div>
            <div className="form-group col-md-2"></div>
          </div>
          <div className="form-group row">
            <div className="form-group col-md-2"></div>
            <div className="form-group col-md-8">
              <label htmlFor="accountId">Account ID</label>
              <input
                name="accountId"
                type="number"
                className="form-control"
                id="accountId"
                value={this.state.data.accountId}
                onChange={this.handleChange}
              />
              {this.state.errors.accountId && (
                <div className="alert alert-danger">
                  {this.state.errors.accountId}
                </div>
              )}
            </div>
            <div className="form-group col-md-2"></div>
          </div>
          <br />
          <div className="input-group-append">
            <button
              className="btn btn-primary"
              type="submit"
              disabled={this.validate()}
            >
              Submit Request
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default CreateRequest;
