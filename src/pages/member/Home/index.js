import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'

import { makeStyles } from '@material-ui/core/styles'
import { Card, CardContent, Typography } from '@material-ui/core'

import UserProgress from './UserProgress'

import House from 'assets/house.svg'
import { COLORS } from 'constants/index'
import { fetchBackend, updateEvents } from 'utils'

const useStyles = makeStyles({
  container: {
    maxWidth: '85%',
    display: 'flex',
    flexWrap: 'wrap',
    margin: '75px auto',
    padding: '14px'
  },
  header: {
    color: COLORS.BIZTECH_GREEN,
    width: '100%'
  },
  column: {
    flex: '1'
  },
  card: {
    position: 'relative',
    margin: '10px 10px 0 0',
    overflow: 'visible'
  },
  flexbox: {
    display: 'flex',
    width: '100%'
  },
  house: {
    position: 'absolute',
    width: '33%',
    bottom: '0px',
    right: '10px'
  },
  green: {
    color: COLORS.BIZTECH_GREEN
  },
  eventName: {
    fontSize: '24px',
    fontWeight: 'normal'
  },
  eventDate: {
    fontWeight: 'normal',
    color: COLORS.FONT_COLOR
  }
})

function MemberHome (props) {
  const classes = useStyles()
  const [registeredEvents, setRegisteredEvents] = useState([])
  const [featuredEvent, setFeaturedEvent] = useState({})
  const [nextEvent, setNextEvent] = useState({})
  const getFeaturedEvent = () => {
    if (props.events && props.events.length) {
      setFeaturedEvent(props.events[Math.floor(Math.random() * (props.events.length - 1))])
    }
  }

  /**
   * gets the next event that the user is registered for
   * verifies that the event is after the current time
   * sets next event to 'None Registered!' if no events found
   */
  const getNextEvent = async () => {
    if (!props.user) return null
    const params = new URLSearchParams({
      id: props.user.id
    })
    await fetchBackend(`/registrations?${params}`, 'GET')
      .then(async response => {
        if (response && response.size > 0) {
          setRegisteredEvents(response.data)
          // iterate over events - the first one that is found in registrations is the closest event assuming that events are already sorted by date
          if (props.events) {
            props.events.forEach(event => {
              const index = response.data.findIndex(registration => registration.eventID === event.id)
              if (index !== -1) {
                // if the event has not passed yet
                if (new Date(event.startDate).getTime() > new Date().getTime()) {
                  return setNextEvent(event)
                } else {
                  return setNextEvent({
                    ename: 'None Registered!'
                  })
                }
              }
            })
          }
        } else {
          setNextEvent({
            ename: 'None Registered!'
          })
        }
      })
      .catch(() => {
        setNextEvent({
          ename: 'None Registered!'
        })
      })
  }

  if (!props.events) {
    updateEvents()
  }

  // set featured event and nextEvent on initial render
  if (!featuredEvent.ename && !nextEvent.ename) {
    getFeaturedEvent()
    getNextEvent()
  }

  function CardComponent (props) {
    return (
      <Card className={classes.card}>
        <CardContent>
          {props.children}
        </CardContent>
      </Card>
    )
  }

  function eventDate (date) {
    return new Date(date)
      .toLocaleDateString('en-US', { day: 'numeric', weekday: 'long', month: 'long', year: 'numeric' })
  }

  return (
    <React.Fragment>
      <Helmet>
        <title>Biztech User Dashboard</title>
      </Helmet>
      <div className={classes.container}>
        <Typography variant='h1' className={classes.header}>Home</Typography>
        <div className={classes.column}>
          <CardComponent>
            <Typography variant='h2'>Hi {props.user.fname}!</Typography>
            <Typography>You are X events away from a reward!</Typography>
            <img src={House} className={classes.house} alt='BizTech House' />
          </CardComponent>
          <CardComponent>
            <Typography variant='h2'>Progress</Typography>
            <UserProgress registeredEvents={registeredEvents} />
          </CardComponent>
        </div>
        <div className={classes.column}>
          <CardComponent>
            <Typography variant='h2'>Sticker Collection</Typography>
          </CardComponent>
          <CardComponent>
            <Typography variant='h2'>Prizes</Typography>
          </CardComponent>
          <div className={classes.flexbox}>
            <div className={classes.column}>
              <CardComponent>
                <Typography variant='h2' className={classes.green}>Next Event</Typography>
                <Typography className={classes.eventName}>{nextEvent.ename}</Typography>
                <Typography className={classes.eventDate}>{nextEvent.startDate && eventDate(nextEvent.startDate)}</Typography>
              </CardComponent>
            </div>
            <div className={classes.column}>
              <CardComponent>
                <Typography variant='h2' className={classes.green}>Featured</Typography>
                <Typography className={classes.eventName}>{featuredEvent.ename}</Typography>
                <Typography className={classes.eventDate}>{featuredEvent.startDate && eventDate(featuredEvent.startDate)}</Typography>
              </CardComponent>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}

function mapStateToProps (state) {
  return {
    events: state.pageState.events
  }
}

export default connect(mapStateToProps)(MemberHome)