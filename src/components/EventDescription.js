import React, { useState, useLayoutEffect } from "react";
import { withRouter } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Markdown from "./Markdown";
import Paper from "@material-ui/core/Paper";
import { COLOR, REGISTRATION_STATUS } from "../constants/Constants";
import { fetchBackend } from "../utils";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import Slide from "@material-ui/core/Slide";
import VisibilityIcon from "@material-ui/icons/Visibility";
import StarBorderOutlinedIcon from "@material-ui/icons/StarBorderOutlined";
import StarIcon from "@material-ui/icons/Star";

let settingFavouriteData = false;
let settingRegistrationData = false;
const useStyles = makeStyles(theme => ({
  layout: {
    [theme.breakpoints.up("sm")]: {
      width: 600,
      margin: "auto"
    }
  },
  paper: {
    maxWidth: "1274px",
    padding: "60px 0 80px 95px",
    position: "relative"
  },

  title: {
    display: "inline-block",
    fontSize: "36px"
  },
  description: {
    margin: "50px 0px 67px 0px"
  },

  favLogo: {
    position: "absolute",
    top: "4.5px",
    right: "100px",
    fill: COLOR.BIZTECH_GREEN,
    fontSize: "32px"
  },
  viewLogo: {
    position: "absolute",
    right: "150px",
    top: "6px",
    fontSize: "32px"
  },
  button: {
    marginLeft: "10px",
    color: COLOR.WHITE,
    padding: "6px 12px"
  },
  buttonGroup: {
    position: "absolute",
    right: "100px"
  }
}));

const sendFavouriteData = async (userID, eventID, isFavourite) => {
  if (settingFavouriteData === true) {
    return Promise.resolve("in_progress");
  }
  settingFavouriteData = true;
  const bodyData = {
    eventID: eventID,
    isFavourite: isFavourite
  };
  try {
    await fetchBackend(`/users/favEvent/${userID}`, "PATCH", bodyData);
    settingFavouriteData = false;
    let responesMsg = "";
    isFavourite ? (responesMsg = "favourite") : (responesMsg = "unfavourite");
    responesMsg += " succeed";
    return Promise.resolve(responesMsg);
  } catch (error) {
    settingFavouriteData = false;
    return Promise.reject(error);
  }
};

const sendRegistrationData = async (id, eventID, isRegister, isFirstTime) => {
  if (settingRegistrationData === true) {
    return Promise.resolve("in_progress");
  }
  settingRegistrationData = true;
  let registrationStatus = "";
  let method = "";
  let path = "";
  let body = {
    eventID: eventID,
    registrationStatus: registrationStatus
  };
  if (isRegister) {
    registrationStatus = REGISTRATION_STATUS.REGISTERED;
  } else {
    registrationStatus = REGISTRATION_STATUS.CANCELLED;
  }
  if (isFirstTime) {
    body["id"] = id;
    method = "POST";
    path = "/registrations";
  } else {
    method = "PUT";
    path = `/registrations/${id}`;
  }
  try {
    await fetchBackend(path, method, body);
    settingRegistrationData = false;
    let responesMsg = "";
    isRegister
      ? (responesMsg = "registration")
      : (responesMsg = "unregistration");
    responesMsg += " succeed";
    return Promise.resolve(responesMsg);
  } catch (error) {
    settingRegistrationData = false;
    return Promise.reject(error);
  }
};

const TransitionUp = props => {
  return <Slide {...props} direction="up" />;
};

const EventDescription = ({ user, event, registration, children }) => {
  const classes = useStyles();
  const [eventFavStatus, setEventFavStatus] = useState(false);
  const [eventRegistrationStatus, setEventRegistrationStatus] = useState(false);
  const [snackOpen, setSnackOpen] = React.useState(false);
  const [snackMsg, setSnackMsg] = React.useState("");
  //called after the first dom mutation, right before render()
  useLayoutEffect(() => {
    if (event && user && user.favedEventsID) {
      if (user.favedEventsID.indexOf(event.id) !== -1) {
        setEventFavStatus(true);
      }
    }
    if (
      registration &&
      registration.registrationStatus === REGISTRATION_STATUS.REGISTERED
    ) {
      setEventRegistrationStatus(true);
    }
  }, [event, user, registration]);

  const handleClickFavouriteEvent = async (userID, eventID) => {
    const currFavStatus = eventFavStatus;
    try {
      const favResult = await sendFavouriteData(
        userID,
        eventID,
        !currFavStatus
      );
      setEventFavStatus(!currFavStatus);
      openSnackBar(favResult);
    } catch (error) {
      openSnackBar(error);
    }
  };

  const handleClickRegisterOrUnRegisterEvent = async (
    userID,
    eventID,
    isRegister
  ) => {
    let isFirstTime = false;
    registration ? (isFirstTime = false) : (isFirstTime = true); //if registration prop is not undefined, the event has been registered / unregistered before
    
    try {
      const registrationResult = await sendRegistrationData(
        userID,
        eventID,
        isRegister,
        isFirstTime
      );
      setEventRegistrationStatus(isRegister);
      openSnackBar(registrationResult);
    } catch (error) {
      openSnackBar(error);
    }
  };

  const openSnackBar = msg => {
    setSnackMsg(msg);
    setSnackOpen(true);
    setTimeout(() => {
      setSnackOpen(false);
    }, 1000);
  };

  return (
    <React.Fragment>
      <Paper className={classes.paper}>
        <div style={{ position: "relative" }}>
          <Typography variant="h1" className={classes.title}>
            {event.id}
          </Typography>
          <VisibilityIcon
            className={classes.viewLogo}
            fill="none"
          ></VisibilityIcon>
          {eventFavStatus ? (
            <StarIcon
              className={classes.favLogo}
              onClick={() => {
                handleClickFavouriteEvent(user.id, event.id);
              }}
            ></StarIcon>
          ) : (
            <StarBorderOutlinedIcon
              className={classes.favLogo}
              onClick={() => {
                handleClickFavouriteEvent(user.id, event.id);
              }}
            ></StarBorderOutlinedIcon>
          )}
        </div>
        <Markdown className={classes.description}>{event.description}</Markdown>
        <div className={classes.buttonGroup}>
          {eventRegistrationStatus ? (
            <React.Fragment>
              <Button
                style={{ backgroundColor: COLOR.LIGHT_BACKGROUND_COLOR }}
                className={classes.button}
                onClick={() => {
                  handleClickRegisterOrUnRegisterEvent(user.id, event.id, false)
                }}
              >
                Unregiseter
              </Button>
              <Button
                disabled
                style={{ backgroundColor: COLOR.BIZTECH_GREEN }}
                className={classes.button}
              >
                Registered
              </Button>
            </React.Fragment>
          ) : (
            <Button
              style={{ backgroundColor: COLOR.BIZTECH_GREEN }}
              className={classes.button}
            >
              sign me up
            </Button>
          )}
        </div>
      </Paper>
      <Snackbar
        open={snackOpen}
        TransitionComponent={TransitionUp}
        message={snackMsg}
        key="favourite"
      />
    </React.Fragment>
  );
};

export default withRouter(EventDescription);
