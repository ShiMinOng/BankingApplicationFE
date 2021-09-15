import React, { Component } from "react";
import auth from "../../services/authService";
import * as requestService from "../../services/serviceTrackerService";
import * as accountService from "../../services/accountService";

class ViewServiceRequest extends Component {
  state = {
    serviceRequests: [],
    searchRequestId: null,
    columns: [
      "Service ID",
      "Service Description",
      "Service Raised Date",
      "Service Status",
      "Account ID",
    ],
    serviceRequest: null,
  };

  componentDidMount() {
    this.retrieveRequests();
  }

  onChangeSearchId = (e) => {
    console.log("inside onChangeSearchId");
    const searchRequestId = e.target.value;
    console.log(searchRequestId);
    this.setState({
      searchRequestId: searchRequestId,
    });
  };

  retrieveRequests = async () => {
    const array = await accountService.getAccountIds(auth.getCurrentUserId());
    requestService
      .getAccountReq(array.data)
      .then((response) => {
        this.setState({
          serviceRequests: response.data,
          columns: this.state.columns,
        });
        console.log(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
    console.log(
      "requests retrieved in retrieveRequest() JS function " +
        this.state.serviceRequests
    );
  };

  searchRequestId = () => {
    requestService
      .getOneRequest(this.state.searchRequestId)
      .then((response) => {
        this.setState({
          serviceRequest: response.data,
        });
        console.log(response.data);
      })
      .catch((ex) => {
        if (ex.response && ex.response.status === 400) {
          console.log(ex.response + " " + ex.responsestatus);
        }
        // } else if (ex.response && ex.response.status === 500) {
        //   alert(ex.response.data.message);
        // }
      });
    // .catch((e) => {
    //   console.log(e);
    // });
  };

  render() {
    return (
      <div>
        <div className="input-group m-3">
          <input
            type="number"
            className="form-control"
            placeholder="Search by Service Request ID"
            value={this.state.searchRequestId}
            onChange={this.onChangeSearchId}
          />
          <div>
            <button
              className="btn btn-dark"
              type="button"
              onClick={this.searchRequestId}
            >
              <b>Search</b>
            </button>
          </div>
        </div>
        {!this.state.serviceRequests && (
          <div>There is nothing in the service request</div>
        )}
        <table className="container">
          {this.state.serviceRequests && (
            <thead>
              <tr>
                {this.state.columns.map((column) => (
                  <th className="clickable" key={column}>
                    {column}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {this.state.serviceRequest && (
              <tr key={this.state.serviceRequest.serviceId}>
                <td key={this.state.serviceRequest.serviceId}>
                  {this.state.serviceRequest.serviceId}
                </td>
                <td key={this.state.serviceRequest.serviceDesc}>
                  {this.state.serviceRequest.serviceDesc}
                </td>
                <td key={this.state.serviceRequest.serviceRaiseDate}>
                  {this.state.serviceRequest.serviceRaiseDate}
                </td>
                <td key={this.state.serviceRequest.serviceStatus}>
                  {this.state.serviceRequest.serviceStatus}
                </td>
                <td key={this.state.serviceRequest.accountId}>
                  {this.state.serviceRequest.accountId}
                </td>
              </tr>
            )}
            {!this.state.serviceRequest &&
              this.state.serviceRequests &&
              this.state.serviceRequests.map((req) => (
                <tr key={req.serviceId}>
                  <td key={req.serviceId}>{req.serviceId}</td>
                  <td key={req.serviceDesc}>{req.serviceDesc}</td>
                  <td key={req.serviceRaiseDate}>{req.serviceRaiseDate}</td>
                  <td key={req.serviceStatus}>{req.serviceStatus}</td>
                  <td key={req.accountId}>{req.accountId}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default ViewServiceRequest;
