import React, { Component } from "react";
import CreateRequest from "./CreateRequest";
import ViewServiceRequest from "./ViewServiceRequest";
import UpdateRequestStatus from "./UpdateRequestStatus";
import ViewAllRequests from "./ViewAllRequests";

import { Tabs, Tab } from "react-bootstrap";

class ServiceTrackerComponent extends Component {
  render() {
    const { role } = this.props;
    return (
      <div>
        <h2>Service Requests</h2>
        {role === "CUSTOMER" && (
          <React.Fragment>
            <Tabs defaultActiveKey="CreateRequest">
              <Tab eventKey="create" title="Create Request">
                <CreateRequest />
              </Tab>
              <Tab eventKey="viewServiceRequest" title="View Service Request">
                <ViewServiceRequest />
              </Tab>
            </Tabs>
          </React.Fragment>
        )}
        {role === "ADMIN" && (
          <React.Fragment>
            <Tabs defaultActiveKey="UpdateStatus">
              <Tab eventKey="update" title="Update Status">
                <UpdateRequestStatus />
              </Tab>
              <Tab eventKey="viewAllRequests" title="View All Requests">
                <ViewAllRequests />
              </Tab>
            </Tabs>
          </React.Fragment>
        )}
      </div>
    );
  }
}

export default ServiceTrackerComponent;
