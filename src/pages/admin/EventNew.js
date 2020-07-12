import React, { useState } from 'react'
import * as Yup from 'yup'
import { Formik } from 'formik'
import NewEventForm from '../../components/Forms/NewEvent'
import EventView from '../../components/EventView'
import { fetchBackend, log } from '../../utils'
import { Helmet } from 'react-helmet'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'

const useStyles = makeStyles(theme => ({
  layout: {
    [theme.breakpoints.up('sm')]: {
      display: 'flex',
      margin: 'auto'
    }
  },
  paper: {
    [theme.breakpoints.up('sm')]: {
      width: 600,
      margin: theme.spacing(3)
    }
  },
  content: {
    padding: theme.spacing(3)
  }
}))

export default function EventNew () {
  const classes = useStyles()
  const [previewEvent, setPreviewEvent] = useState({})

  const validationSchema = Yup.object({
    name: Yup.string().required(),
    slug: Yup.string().matches(/^[a-z\-0-9]*$/, 'Slug must be lowercase and have no whitespace').required(),
    description: Yup.string().required(),
    capacity: Yup.number('Valid number required')
      .min(0, 'Valid capacity required')
      .required(),
    // partners: Yup.string().required(),
    location: Yup.string().required(),
    longitude: Yup.number('Valid number required')
      .min(-180, 'Valid number required')
      .max(180, 'Valid number required')
      .required(),
    latitude: Yup.number('Valid number required')
      .min(-180, 'Valid number required')
      .max(180, 'Valid number required')
      .required(),
    facebookUrl: Yup.string().url(),
    imageUrl: Yup.string().url().required()
  })

  const initialValues = {
    name: '',
    slug: '',
    description: '',
    capacity: '',
    facebookUrl: '',
    location: '',
    longitude: '',
    latitude: '',
    imageUrl: '',
    startDate: new Date(),
    endDate: new Date()
  }

  return (
    <div className={classes.layout}>
      <Helmet>
        <title>Create Event - BizTech Admin</title>
      </Helmet>
      <Paper className={classes.paper}>
        <div className={classes.content}>
          <Typography variant='h4' align='center' gutterBottom>
                        New Event
          </Typography>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={submitValues}
          >
            {props => <NewEventForm updatePreview={setPreviewEvent} {...props} />}
          </Formik>
        </div>
      </Paper>

      <Paper className={classes.paper}>
        <EventView event={previewEvent}/>
      </Paper>
    </div>
  )

  async function submitValues (values) {
    const body = {
      name: values.name,
      id: values.slug,
      description: values.description,
      capac: values.capacity,
      location: values.location,
      longitude: values.longitude,
      latitude: values.latitude,
      imageUrl: values.imageUrl,
      facebookUrl: values.facebookUrl,
      startDate: values.startDate,
      endDate: values.endDate
    }
    fetchBackend('/events', 'POST', body)
      .then(response => {
        alert(response.message)
        window.location.href = '/'
      })
      .catch(err => {
        log(err)
        if (err.status === 409) {
          alert('Failed. Event with that slug/id already exists')
        } else alert(err.message + ' Please contact a dev')
      })
  }
}
