import React from "react";
import MaterialTable from "material-table";
import { connect } from "react-redux";
import { API_URL, API_KEY } from "../utils";

/**
 * Functional component that displays event user table populated from the backend
 * When a user check-in status is changed, the backend is updated and it fetches new data
 * @param {*} props userData from redux store; eventID from parent Events page
 */
function EventUserTable(props) {
  // current sample data, but will get from Events.js in the future
  let users = props.userData;
  const eventID = props.eventID;
  console.log(props.eventID);

  for (let i = 0; i < users.length; i += 1) {
    rows.push(
      createData(
        users[i].name,
        users[i].studentNumber,
        users[i].email,
        users[i].checkedIn
      )
    );
  }

  function createData(name, studentNumber, email, checkedIn) {
    return { name, studentNumber, email, checkedIn };
  }

  const rows = [];

  /**
   * Helper function to determine whether to display action for check-in or undo check-in
   * @param {*} checkedIn current status of user
   */
  function displayAction(checkedIn) {
    const displayRegister = {
      icon: "check",
      tooltip: "Check-in member to event to confirm attendance",
      onClick: (event, rowData) => {
        // Do check-in operation
        if (window.confirm("You want to check-in " + rowData.name + "?")) {
          const registrationStatus = true;
          registerUser(rowData.studentNumber, registrationStatus);
        }
      }
    };
    const displayDeregister = {
      icon: "remove",
      tooltip: "Undo member check-in",
      onClick: (event, rowData) => {
        // Do undo check-in operation
        if (window.confirm("You want to undo check-in " + rowData.name + "?")) {
          const registrationStatus = false;
          registerUser(rowData.studentNumber, registrationStatus);
        }
      }
    };
    return checkedIn ? displayDeregister : displayRegister;
  }

  async function registerUser(id, registrationStatus) {
    const body = JSON.stringify({
      eventID: eventID,
      id: id,
      registrationStatus: registrationStatus
    });

    fetch(API_URL + "/registration/create", {
      method: "POST",
      headers: {
        "x-api-key": API_KEY,
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body
    })
      .then(response => response.json())
      .then(response => {
        console.log(response);
      });
  }

  /**
   * Creates event table using MaterialTable library
   */
  return (
    <MaterialTable
      title="Event Attendance"
      columns={[
        { title: "Full Name", field: "name" },
        {
          title: "Student Number",
          field: "studentNumber",
          type: "numeric",
          sorting: false
        },
        { title: "Email", field: "email", sorting: false }
      ]}
      data={rows}
      // Configure options for the table
      options={{
        search: true,
        draggable: false,
        padding: "dense",
        pageSize: 20,
        pageSizeOptions: [20, 50, 100],
        actionsColumnIndex: 4,
        exportButton: true,
        headerStyle: {
          fontWeight: "bold"
        },
        rowStyle: rowData => ({
          backgroundColor: rowData.checkedIn === true ? "#54D26E" : "#FFF"
        })
      }}
      actions={[rowData => displayAction(rowData.checkedIn)]}
    />
  );
}

const mapStateToProps = state => {
  return {
    userData: state.pageState.eventUserList
  };
};

export default connect(mapStateToProps, null)(EventUserTable);
