import React, { Component } from "react";
import * as requestService from "../../services/serviceTrackerService";

class ViewAllRequests extends Component {
  state = {
    serviceRequests: [],
    columns: [
      "Service ID",
      "Service Description",
      "Service Raised Date",
      "Service Status",
      "Account ID",
    ],
  };

  componentDidMount() {
    this.retrieveAllRequests();
  }

  retrieveAllRequests = async () => {
    requestService
      .getAllRequests()
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
      "requests retrieved in retrieveAllRequests() " +
        this.state.serviceRequests
    );
  };

  render() {
    if (!this.state.serviceRequests) {
      return <div>There is no request in the database</div>;
    }
    return (
      <div>
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
            {this.state.serviceRequests.map((req) => (
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

export default ViewAllRequests;
