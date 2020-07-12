import React, { useState } from 'react'
import { useParams, useHistory, withRouter } from 'react-router-dom'
import * as Yup from 'yup'
import { Formik } from 'formik'
import EditEventForm from '../../components/Forms/EditEvent'
import EventView from '../../components/EventView'
import { fetchBackend, updateEvents } from '../../utils'
import { connect } from 'react-redux'
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

function EventEdit (props) {
  const classes = useStyles()
  const { id: eventId } = useParams()
  const [event, setEvent] = useState(null)
  const [previewEvent, setPreviewEvent] = useState({})
  const history = useHistory()

  const { events } = props
  if (!events) {
    updateEvents()
  }

  // Get the initial values
  if (!event && events && eventId) {
    const event = events.find(event => event.id === eventId)
    setEvent(event)
    setPreviewEvent(event)
  }

  const validationSchema = Yup.object({
    name: Yup.string().required(),
    description: Yup.string().required(),
    capacity: Yup.number('Valid number required')
      .min(0, 'Valid capacity required')
      .required(),
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

  const initialValues = event ? {
    name: event.name,
    slug: event.id,
    description: event.description,
    capacity: event.capac,
    facebookUrl: event.facebookUrl,
    location: event.location || '',
    longitude: event.longitude || '',
    latitude: event.latitude || '',
    imageUrl: event.imageUrl,
    startDate: event.startDate,
    endDate: event.endDate
  } : {
    name: '',
    description: '',
    capacity: '',
    facebookUrl: '',
    location: '',
    longitude: '',
    latitude: '',
    imageUrl: '',
    startDate: '',
    endDate: ''
  }

  return event && (
    <div className={classes.layout}>
      <Helmet>
        <title>{`Edit ${event.name} - BizTech Admin`}</title>
      </Helmet>
      <Paper className={classes.paper}>
        <div className={classes.content}>
          <Typography variant='h4' align='center' gutterBottom>
                        Edit Event
          </Typography>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={submitValues}
          >
            {props => <EditEventForm updatePreview={setPreviewEvent} {...props} />}
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

    fetchBackend(`/events/${values.slug}`, 'PATCH', body)
      .then((response) => {
        alert(response)
        history.push(`/event/${values.slug}/register`)
      })
      .catch(err => {
        console.log(err)
        alert(err.message + ' Please contact a dev')
      })
  }
}
const mapStateToProps = state => {
  return {
    events: state.pageState.events
  }
}

export default withRouter(connect(mapStateToProps, {})(EventEdit))
