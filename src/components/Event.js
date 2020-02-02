import React from "react";
// import Sheet from "./Sheet";
import EventUserTable from "./EventUserTable";
import CircularProgress from "@material-ui/core/CircularProgress";

export default function Event(props) {
  const event = props.event;
  return event ? (
    <div>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <h1>Event: {event.ename}</h1>
      <EventUserTable eventID={event.id} />
    </div>
  ) : (
    <CircularProgress />
  );
}
