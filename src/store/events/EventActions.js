import { SET_EVENTS, SET_EVENTS_REGISTERED } from 'constants/index'

export function setEvents (events) {
  return {
    type: SET_EVENTS,
    events
  }
}

export function setEventsRegistered (eventsRegistered) {
  return {
    type: SET_EVENTS_REGISTERED,
    eventsRegistered
  }
}