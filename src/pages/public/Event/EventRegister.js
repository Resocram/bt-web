import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet'
import { Formik } from 'formik'
import * as Yup from 'yup'

import EventView from 'components/Event/EventView'
import EventRegisterForm from './EventRegisterForm'
import NotFound from 'pages/NotFound'

import { makeStyles } from '@material-ui/core/styles'
import { Grid, Paper } from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'

import { fetchBackend, updateEvents } from 'utils'

const useStyles = makeStyles(theme => ({
  layout: {
    [theme.breakpoints.up('sm')]: {
      width: 600,
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
  }
}))

const EventFormContainer = (props) => {
  const classes = useStyles()
  const { events } = props
  const { id: eventId } = useParams()

  const [event, setEvent] = useState(null)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (eventId && events) {
      setEvent(events.find(event => event.id === eventId))
      setLoaded(true)
    } else if (!events) {
      updateEvents()
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
    faculty: Yup.string().required('Faculty is required'),
    year: Yup.string().required('Level of study is required'),
    diet: Yup.string().required('Dietary restriction is required')
  })

  const initialValues = { email: '', fname: '', lname: '', id: '', faculty: '', year: '', diet: '', gender: '', heardFrom: '' }

  if (loaded && events) {
    return event ? (
      <div className={classes.layout}>
        <Helmet>
          <title>{event.ename} - Register</title>
        </Helmet>
        <Paper className={classes.paper}>
          <EventView event={event}>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={submitValues}
            >
              {props => <EventRegisterForm {...props} />}
            </Formik>
          </EventView>
        </Paper>
      </div>
    ) : (
      <NotFound message='The event could not be found!'/>
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
    // TODO: Standardize the values passed to DB (right now it passes "1st Year" instead of 1)
    fetchBackend(`/users/${values.id}`, 'GET')
      .then((response) => {
        fetchBackend(`/users/${id}`, 'PATCH', body)
        registerUser(id, eventID, heardFrom)
      })
      .catch(() => {
        // Need to create new user
        fetchBackend('/users', 'POST', body)
          .then((userResponse) => {
            if (userResponse.message === 'Created!') {
              registerUser(id, eventID, heardFrom)
            } else {
              alert('Signup failed')
            }
          })
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
    events: state.eventState.events
  }
}

export default connect(mapStateToProps, {})(EventFormContainer)
