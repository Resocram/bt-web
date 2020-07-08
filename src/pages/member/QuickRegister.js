import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { connect } from 'react-redux'
import { makeStyles } from '@material-ui/core/styles'
import { fetchBackend, updateEvents } from '../../utils'
import * as Yup from 'yup'
import { Formik } from 'formik'
import RegisterQuick from '../../components/Forms/RegisterQuick'
import Paper from '@material-ui/core/Paper'
import Grid from '@material-ui/core/Grid'
import Skeleton from '@material-ui/lab/Skeleton'
import { Helmet } from 'react-helmet'
import { Typography } from '@material-ui/core'
import ArrowBackIcon from '@material-ui/icons/ArrowBack'

const useStyles = makeStyles(theme => ({
  layout: {
    [theme.breakpoints.up('sm')]: {
      width: '66vw',
      margin: 'auto'
    }
  },
  paper: {
    [theme.breakpoints.up('sm')]: {
      margin: theme.spacing(3)
    }
  },
  content: {
    padding: theme.spacing(3)
  },
  container: {
    width: '33vw',
    padding: '55px 0 55px 80px'
  },
  header: {
    fontWeight: 'bold'
  },
  subHeader: {
    fontSize: '24px'
  }
}))

const EventFormContainer = (props) => {
  const classes = useStyles()
  const { events } = props
  const { user } = props
  const history = useHistory()

  if (!events) {
    updateEvents()
  }
  const { id: eventId } = useParams()

  const [event, setEvent] = useState(null)

  const handleReturnClick = (e) => {
    history.push('/events')
  }

  useEffect(() => {
    if (eventId && events) {
      setEvent(events.find(event => event.id === eventId))
    }
  }, [events, eventId])

  const validationSchema = Yup.object({
    email: Yup.string().email().required(),
    id: Yup.number('Valid Student ID required')
      .min(9999999, 'Valid Student ID required')
      .max(100000000, 'Valid Student ID required')
      .required(),
    fname: Yup.string().required('First name is required'),
    lname: Yup.string().required('Last name is required'),
    year: Yup.string().required('Level of study is required'),
    diet: Yup.string().required('Dietary restriction is required')
  })

  const initialValues = { email: user.email, fname: user.fname, lname: user.lname, id: user.id, faculty: user.faculty, year: user.year, diet: user.diet, gender: user.gender, heardFrom: '' }

  if (event) {
    return (
      <div className={classes.layout}>
        <Helmet>
          <title>{event.ename} - Register</title>
        </Helmet>
        <div style={{ display: 'flex', cursor: 'pointer' }} onClick={handleReturnClick}>
          <ArrowBackIcon style={{ fontSize: '32px', paddingRight: '5px' }}/>
          <Typography style={{ fontSize: '24px' }}>All Events</Typography>
        </div>

        <Paper className={classes.paper}>
          <div className={classes.container}>
            <Typography variant='h2' className={classes.header}>
              {event.ename}
            </Typography>
            <Typography className={classes.subHeader}>
              Sign up Form
            </Typography>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={submitValues}>
              {props => <RegisterQuick {...props} />}
            </Formik>
          </div>
        </Paper>
      </div>
    )
  } else {
    return (
      <div className={classes.layout}>
        <Paper className={classes.paper}>
          <Skeleton animation='wave' variant='rect' width={'100%'} height={320} />
          <div className={classes.content}>

            <Grid container spacing={3}>

              <Grid item xs={12}>
                <Skeleton animation='wave' variant='rect' width={300} height={30} />
              </Grid>

              {[1, 2, 3].map((e) =>
                <Grid item container spacing={1} key={e}>
                  <Grid item xs={12}>
                    <Skeleton animation='wave' variant='rect' width={130} height={20} />
                  </Grid>
                  <Grid item xs={12}>
                    <Skeleton animation='wave' variant='rect' width={'100%'} height={20} />
                  </Grid>
                </Grid>)
              }

              <Grid item xs={12}>
                <Skeleton animation='wave' variant='rect' width={90} height={36} />
              </Grid>

            </Grid>
          </div>
        </Paper>
      </div>
    )
  }

  async function submitValues (values) {
    const { email, fname, lname, id, faculty, year, diet, heardFrom, gender } = values
    const eventID = event.id
    // TODO: Standardize the values passed to DB (right now it passes "1st Year" instead of 1)
    fetchBackend(`/users/${values.id}`, 'GET')
      .then((response) => {
        const body = {
          id,
          fname,
          lname,
          email,
          year,
          faculty,
          gender,
          diet
        }
        if (response === 'User not found.') {
          // Need to create new user
          // console.log("User not found, creating user");
          fetchBackend('/users', 'POST', body)
            .then((userResponse) => {
              if (userResponse.message === 'Created!') {
                registerUser(id, eventID, heardFrom)
              } else {
                alert('Signup failed')
              }
            })
        } else {
          fetchBackend(`/users/${id}`, 'PATCH', body)
            .catch(response => {
              console.log(response)
            })
          registerUser(id, eventID, heardFrom)
        }
      })
      .catch(err => {
        console.log('registration error', err)
        alert('Signup failed')
      })
  }

  async function registerUser (id, eventID, heardFrom) {
    const body = {
      id,
      eventID,
      heardFrom,
      registrationStatus: 'registered'
    }
    fetchBackend('/registrations', 'POST', body)
      .then((regResponse) => {
        alert('Signed Up')
      })
      .catch(err => {
        if (err.status === 409) {
          alert('You cannot sign up for this event again!')
        } else {
          alert('Signup failed')
        }
      })
  }
}

const mapStateToProps = state => {
  return {
    events: state.pageState.events,
    user: state.userState.user
  }
}

export default connect(mapStateToProps, {})(EventFormContainer)
