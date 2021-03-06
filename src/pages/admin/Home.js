import React from 'react'
import { useHistory } from 'react-router-dom'
import { Helmet } from 'react-helmet'

import { makeStyles } from '@material-ui/core/styles'
import {
  Box,
  Card,
  CardHeader,
  CardActionArea,
  CardMedia,
  IconButton,
  Menu,
  MenuItem,
  Typography
} from '@material-ui/core'

import { MoreVert as MoreVertIcon } from '@material-ui/icons'

import { COLORS } from 'constants/index'
import { deleteEvent } from 'store/event/eventActions'

const useStyles = makeStyles({
  card: {
    width: '30%',
    margin: '15px 30px 15px 0'
  },
  media: {
    height: 250
  },
  row: {
    display: 'flex',
    paddingLeft: '15px'
  },
  columnLeft: {
    flex: '50%',
    textAlign: 'left'
  }
})

function AdminHome (props) {
  const { events } = props
  const classes = useStyles()

  const history = useHistory()
  const [anchorEl, setAnchorEl] = React.useState(null)
  const [eventMenuClicked, setEventMenuClicked] = React.useState(null)

  const handleClick = (e, event) => {
    setAnchorEl(e.currentTarget)
    setEventMenuClicked(event)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleClickEditEvent = () => {
    history.push(`/admin/event/${eventMenuClicked}/edit`)
    handleClose()
  }

  const handleClickDeleteEvent = async () => {
    const clickedEvent = events.find(event => event.id === eventMenuClicked)
    if (window.confirm(`Are you sure you want to delete ${clickedEvent.ename}? This cannot be undone`)) {
      await deleteEvent({ eventId: clickedEvent.id })
    }
    handleClose()
  }

  const handleClickViewEvent = (eventId) => {
    history.push(`/admin/event/${eventId}`)
    handleClose()
  }

  const handleClickViewEventAsMember = () => {
    history.push(`/event/${eventMenuClicked}`)
    handleClose()
  }

  function createEventCard (event) {
    const image = event.imageUrl || require('assets/placeholder.jpg')
    return (
      <Card className={classes.card} key={event.id}>
        <CardActionArea onClick={() => handleClickViewEvent(event.id)} >
          <CardMedia
            className={classes.media}
            component='img'
            image={image}
            title='Event photo'
          />
        </CardActionArea>
        <CardHeader
          classes={{ subheader: classes.cardHeader }}
          title={event.ename}
          subheader={event.startDate
            ? new Date(event.startDate)
              .toLocaleDateString('en-US', { day: 'numeric', weekday: 'long', month: 'long', year: 'numeric' }) : ''}
          action={
            <IconButton aria-label='more options'
              onClick={e => {
                handleClick(e, event.id)
              }}>
              <MoreVertIcon />
            </IconButton>
          }>
        </CardHeader>
      </Card >
    )
  }

  return (
    <>
      <Helmet>
        <title>BizTech Admin Dashboard</title>
      </Helmet>

      <div className={classes.row}>
        <div className={classes.columnLeft}>
          <Typography variant='h1' style={{ color: COLORS.BIZTECH_GREEN }}>BizTech Admins</Typography>
          <Typography style={{ color: COLORS.BIZTECH_GREEN }}>BizTech Admins</Typography>
        </div>
      </div>

      <Box flexWrap='wrap' display='flex'>
        {events.map(event => createEventCard(event))}
      </Box>

      <Menu
        id='simple-menu'
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClickEditEvent}>Edit Event</MenuItem>
        <MenuItem onClick={handleClickDeleteEvent}>Delete Event</MenuItem>
        <MenuItem onClick={handleClickViewEventAsMember}>View Event as a Member</MenuItem>
      </Menu>
    </>
  )
}

export default AdminHome
