import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { fetchBackend } from '../../utils'

import * as Yup from "yup"
import { Formik } from "formik";
import EventForm from './EventForm';

const useStyles = makeStyles(theme => ({
  content: {
    padding: theme.spacing(3),
  }
}));

const EventFormWrapper = (event) => {
  const classes = useStyles();
  const eventInfo = event.event;
  const validationSchema = Yup.object({
    email: Yup.string().email().required(),
    id: Yup.number('Valid Student ID required')
      .min(9999999, 'Valid Student ID required')
      .max(100000000, 'Valid Student ID required')
      .required(),
    fname: Yup.string().required("First name is required"),
    lname: Yup.string().required("Last name is required"),
    faculty: Yup.string().required("Faculty is required"),
    year: Yup.string().required("Level of study is required"),
    diet: Yup.string().required("Dietary restriction is required"), 
  });

  const initialValues = { email: "", fname: "", lname: "", id: "", faculty: "", year: "", diet: "", gender: "", heardFrom: ""};

  return (
    <React.Fragment>
      <img src={eventInfo.imageUrl || require("../../assets/placeholder.jpg")} alt="Event" style={{maxWidth: '100%'}} />
      
      <div className={classes.content}>
        <Typography variant="h4" align="center" gutterBottom>
          {eventInfo.ename}
        </Typography>
        
        <Typography variant="h6" gutterBottom>
          {eventInfo.description}
        </Typography>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={submitValues}
        >
          {props => <EventForm {...props} />}
        </Formik>
      </div>
    </React.Fragment>
  );

  async function submitValues(values) {
    const { email, fname, lname, id, faculty, year, diet, heardFrom, gender } = values;
    const eventID = eventInfo.id;
    //TODO: Standardize the values passed to DB (right now it passes "1st Year" instead of 1)
    fetchBackend(`/users/get?id=${values.id}`, 'GET')
      .then((response) => response.json())
      .then((response) => {
        if (response === "User not found.") {
          // Need to create new user
          // console.log("User not found, creating user");
          const body = JSON.stringify({
            id,
            fname,
            lname,
            email,
            year,
            faculty,
            gender,
            diet
          });
          fetchBackend("/users/create", "POST", body)
            .then((userResponse) => userResponse.json())
            .then((userResponse) => {
              if (userResponse.message === "Created!") {
                registerUser(id, eventID, heardFrom);
              } else {
                alert("Signup failed");
              }
            })
        } else {
          registerUser(id, eventID, heardFrom);
        }
      })
      .catch(err => {
        console.log("registration error");
        alert("Signup failed");
      });
  }

  async function registerUser(id, eventID, heardFrom) {
    const body = JSON.stringify({
      id,
      eventID,
      heardFrom,
      registrationStatus: "registered"
    })
    fetchBackend("/registration/create", "POST", body)
      .then((regResponse) => regResponse.json())
      .then((regResponse) => {
        if (regResponse.message === "Update succeeded") {
          alert("Signed Up");
        } else {
          console.log("registration error");
          console.log(regResponse.message);
          alert("Signup failed");
        }
      })
      .catch(err => {
        console.log("registration error");
        alert("Signup failed");
      });
  }
}

export default EventFormWrapper;
