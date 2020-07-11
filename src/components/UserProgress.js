import React from 'react'
import { COLOR } from '../constants/Constants'
import { connect } from 'react-redux'
import { makeWidthFlexible, XYPlot, XAxis, YAxis, LineSeries, MarkSeries } from 'react-vis'

const FlexibleXYPlot = makeWidthFlexible(XYPlot)

const getData = () => {
  const data = {}
  const date = new Date()
  let month = date.getMonth()
  let year = date.getFullYear()
  for (let i = 0; i < 6; i++) {
    data[`${year} ${month}`] = 0
    month -= 1
    if (month < 0) {
      month = 11
      year -= 1
    }
  }
  return data
}

const sixMonthsAgo = () => {
  const today = new Date()
  const month = today.getMonth() - 5
  if (month >= 0) {
    const year = today.getFullYear()
    return new Date(year, month)
  } else {
    const year = today.getFullYear() - 1
    return new Date(year, 11 - month)
  }
}

const UserProgress = ({ registeredEvents, events }) => {
  const registeredEventIDs = registeredEvents && registeredEvents.map(event => {
    return event.eventID
  })

  // Find events user is registered for
  const filteredEvents = events && events.filter(event => {
    return registeredEventIDs.includes(event.id)
  })

  const data = getData()

  // Fill in data object
  filteredEvents && filteredEvents.forEach(event => {
    const parsedDate = new Date(event.startDate)
    const year = parsedDate.getFullYear()
    const month = parsedDate.getMonth()
    data[`${year} ${month}`] += 1
  })

  // convert 'date strings' to timestamped react-vis data
  const timestampData = Object.entries(data).map(([key, value]) => {
    const yearMonthToTimestamp = (yearMonth) => {
      const year = yearMonth.split(' ')[0]
      const month = yearMonth.split(' ')[1]
      return new Date(year, month)
    }

    return {
      x: yearMonthToTimestamp(key),
      y: value
    }
  })

  return (
    <FlexibleXYPlot
      xType='time'
      xDomain={[sixMonthsAgo(), Date.now()]}
      yDomain={[0, 4]}
      height={300}
    >
      <XAxis/>
      <YAxis/>
      <LineSeries
        data={timestampData}
        stroke={COLOR.FONT_COLOR}
        color={COLOR.BIZTECH_GREEN}
        style={{}}
      />
      <MarkSeries
        data={timestampData}
        color={COLOR.BIZTECH_GREEN}
      />
    </FlexibleXYPlot>
  )
}

const mapStateToProps = state => {
  return {
    events: state.pageState.events
  }
}

export default connect(mapStateToProps, {})(UserProgress)
