import React, { Component } from "react";
import * as requestService from "../../services/serviceTrackerService";
import Joi from "joi-browser";

// component only available to admin
export class UpdateRequestStatus extends Component {
  state = {
    data: {
      serviceStatus: "PENDING",
      serviceId: null,
    },
    errors: {},
  };

  schema = {
    serviceStatus: Joi.string().required(),
    serviceId: Joi.number().integer().required().label("Account ID"),
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
    console.log(this.state.data);
    try {
      await requestService.changeReqStatus(this.state.data);
      alert("status updated");
      window.location = "/";
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        console.log(ex.response + " " + ex.responsestatus);
        const errors = { ...this.state.errors };
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
              <label htmlFor="serviceId">Service ID</label>
              <input
                name="serviceId"
                type="number"
                className="form-control"
                id="serviceId"
                value={this.state.data.serviceId}
                onChange={this.handleChange}
              />
              {this.state.errors.serviceId && (
                <div className="alert alert-danger">
                  {this.state.errors.serviceId}
                </div>
              )}
            </div>
            <div className="form-group col-md-2"></div>
          </div>
          <div className="form-group row">
            <div className="form-group col-md-2"></div>
            <div className="form-group col-md-8">
              <label htmlFor="serviceStatus">Service Status</label>
              <br />
              <select
                name="serviceStatus"
                className="form-select"
                id="serviceStatus"
                value={this.state.data.serviceStatus}
                onChange={this.handleChange}
              >
                <option value="PENDING">PENDING</option>
                <option value="IN PROGRESS">IN PROGRESS</option>
                <option value="DONE">DONE</option>
              </select>
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
              Submit
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default UpdateRequestStatus;
