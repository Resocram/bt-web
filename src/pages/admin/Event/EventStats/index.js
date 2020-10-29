import React, { useEffect, useState } from 'react'
import { useParams, useHistory } from 'react-router-dom'
import { Helmet } from 'react-helmet'

import { Link } from '@material-ui/core'

import NotFound from 'pages/NotFound'
import EventStatsTable from './EventStatsTable'
import EventStatsSkeleton from './skeleton'

const EventStats = (props) => {
  const { events } = props

  const history = useHistory()
  const { id: eventId } = useParams()

  const [event, setEvent] = useState(null)
  const [loaded, setLoaded] = useState(false)

  // Like componentDidUpdate/DidMount
  useEffect(() => {
    if (eventId) {
      const event = events.find(event => event.id === eventId)
      setEvent(event)
      setLoaded(true)
    }
  }, [eventId])

  const handleEditEventClick = () => {
    if (eventId) history.push(`/admin/event/${eventId}/edit`)
  }

  const handleEventRegisterClick = () => {
    if (eventId) history.push(`/admin/event/${eventId}/register`)
  }

  if (!loaded) return <EventStatsSkeleton />
  return event ? (
    <>
      <Helmet>
        <title>{event.ename} - BizTech Admin</title>
      </Helmet>
      <Link onClick={handleEditEventClick}>Edit Event</Link>
      <Link onClick={handleEventRegisterClick}>Public Event Page</Link>
      <EventStatsTable event={event} />
    </>
  ) : <NotFound message={`The event with id ${eventId} could not be found`}/>
}

export default EventStats
