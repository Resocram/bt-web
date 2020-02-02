import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
//TODO: import props and require the correct type

// import { Auth } from "aws-amplify";
import * as Yup from "yup" //TODO: avoid *, figure out what functions are actually used
import { Formik } from "formik";
import EventForm from './EventForm'; //ian's example form

//Unused but should use down the road (TODO)
// const radioButtonFields = { "Faculty": ["Arts","Commerce","Science","Engineering","Kineseology","Land and Food Systems","Forestry"],
//                             "Year": ["1st Year","2nd Year","3rd Year","4th Year","5+ Year"],
//                             "How did you hear about this event?": ["Facebook","Boothing","Friends","BizTech Newsletter","Faculty Newsletter","Other:"],
//                             "Do you have any dietary restrictions? If yes, please specify in 'Other'": ["No","Other:"]}

const useStyles = makeStyles(theme => ({
  appBar: {
    position: 'relative',
  },
  layout: {
    width: 'auto',
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: 600,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
  },
  stepper: {
    padding: theme.spacing(3, 0, 5),
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
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
    firstname: Yup.string().required("First name is required"),
    lastname: Yup.string().required("Last name is required"),
    // other_option: Yup.string().required("Please enter a response"), //TODO: get other option validation working along with radio button validation 
  });

  const initialValues = { email: "", firstname: "", lastname: "", id: "", faculty: "", year: "", heardFrom: "", diet: ""};


  return (
    <React.Fragment>
      <main className={classes.layout}>
        <Paper className={classes.paper}>
          <Typography component="h1" variant="h4" align="center">
          {eventInfo.ename}

          </Typography>
          <div>
          <img src={eventInfo.imageUrl} alt="Event" height="500" align="middle"></img>
          {/* TODO: fix image scaling */}
          </div>
          <Typography variant="h6" gutterBottom>
                {eventInfo.description}
          </Typography>
          <br></br>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={submitValues}
            >
              {props => <EventForm {...props}/>}
          </Formik>

        </Paper>
      </main>
    </React.Fragment>
  );
  async function submitValues(values) {
      console.log("YOU HAVE HIT THE SUBMIT BUTTON - MSG FROM FORMIK AND EVENTWRAPPER")
      console.log(values.year);
      console.log(values.heardFrom);
      console.log(values.faculty);
      alert("Signed Up");
  }
}

export default EventFormWrapper;
