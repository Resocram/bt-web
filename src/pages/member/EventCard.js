import React from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
import Typography from '@material-ui/core/Typography'
import Card from '@material-ui/core/Card'
import { COLOR } from '../../constants/Constants'

const styles = {
    page: {
        width: '345px',
        marginRight: '34px',
        marginTop: '27px',
    },
    title: {
        color: COLOR.BIZTECH_GREEN,
        fontWeight: 'bold',
        paddingLeft: '37px',
        paddingTop: '10px',
        paddingBottom: '15px'
    },
    eventName: {
        fontSize: '24px',
        paddingLeft: '37px',
        fontWeight: 'normal'
    },
    eventDate: {
        fontSize: '20px',
        paddingLeft: '37px',
        paddingBottom: '23px',
        fontWeight: 'normal',
        color: COLOR.FONT_COLOR
    }
}

function EventCard(props) {
    const { classes } = props
    let eventName = ''
    let eventDate = ''
    if (props.event) {
        eventName = props.event.ename
        if (props.event.startDate) {
            eventDate = new Date(props.event.startDate)
                .toLocaleDateString('en-US', { day: 'numeric', weekday: 'long', month: 'long', year: 'numeric' })
        }
    }

    return (
        <Card classes={{ root: classes.page }}>
            <Typography variant='h2' style={styles.title}>{props.type}</Typography>
            <Typography style={styles.eventName}>{eventName}</Typography>
            <Typography style={styles.eventDate}>{eventDate}</Typography>
        </Card>
    )
}

export default withStyles(styles)(EventCard)
